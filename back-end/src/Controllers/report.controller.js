// src/controllers/report.controller.js
import { Op } from "sequelize";
import PDFDocument from "pdfkit";
import { Parser as Json2CsvParser } from "json2csv";
import Complaint from "../models/complaint.model.js";
import User from "../models/user.models.js";
import sequelize from "../db/index.js"; // for raw queries / fn if needed
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getSummary = asyncHandler(async (req, res) => {
  // totals
  const total = await Complaint.count();

  // by status
  const byStatusRaw = await Complaint.findAll({
    attributes: [
      "status",
      [sequelize.fn("COUNT", sequelize.col("status")), "count"],
    ],
    group: ["status"],
    raw: true,
  });

  const byStatus = byStatusRaw.reduce((acc, cur) => {
    acc[cur.status] = parseInt(cur.count, 10);
    return acc;
  }, {});

  // by submissionType (public/anonymous)
  const bySubmissionTypeRaw = await Complaint.findAll({
    attributes: [
      "submissionType",
      [sequelize.fn("COUNT", sequelize.col("submissionType")), "count"],
    ],
    group: ["submissionType"],
    raw: true,
  });

  const bySubmissionType = bySubmissionTypeRaw.reduce((acc, cur) => {
    acc[cur.submissionType] = parseInt(cur.count, 10);
    return acc;
  }, {});

  // complaints over the last 30 days (counts per day)
  const days = 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);

  const recentComplaints = await Complaint.findAll({
    where: {
      createdAt: {
        [Op.gte]: startDate,
      },
    },
    attributes: ["id", "createdAt"],
    raw: true,
  });

  // build date buckets
  const byDayMap = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    byDayMap[key] = 0;
  }
  recentComplaints.forEach((c) => {
    const key = new Date(c.createdAt).toISOString().slice(0, 10);
    if (byDayMap[key] !== undefined) byDayMap[key] += 1;
  });

  const byDay = Object.keys(byDayMap).map((date) => ({ date, count: byDayMap[date] }));

  // top reporters (users who submitted most complaints) - top 10
  const reportersRaw = await Complaint.findAll({
    attributes: [
      "userId",
      [sequelize.fn("COUNT", sequelize.col("userId")), "count"],
    ],
    where: { userId: { [Op.ne]: null } },
    group: ["userId"],
    order: [[sequelize.literal("count"), "DESC"]],
    limit: 10,
    raw: true,
  });

  const reporterIds = reportersRaw.map((r) => r.userId).filter(Boolean);
  const users = await User.findAll({
    where: { id: reporterIds },
    attributes: ["id", "name", "email"],
    raw: true,
  });

  const byReporter = reportersRaw.map((r) => {
    const u = users.find((x) => x.id === r.userId) || { id: r.userId, name: "Unknown", email: null };
    return { userId: r.userId, name: u.name, email: u.email, count: parseInt(r.count, 10) };
  });

  return res.status(200).json(
    new ApiResponse(200, {
      total,
      byStatus,
      bySubmissionType,
      byDay,
      byReporter,
    })
  );
});

// export CSV of filtered complaints or all
const exportCSV = asyncHandler(async (req, res) => {
  // optional query params: status, from, to
  const { status, from, to } = req.query;
  const where = {};

  if (status) where.status = status;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt[Op.gte] = new Date(from);
    if (to) where.createdAt[Op.lte] = new Date(to);
  }

  const complaints = await Complaint.findAll({
    where,
    include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
    order: [["createdAt", "DESC"]],
    raw: true,
    nest: true,
  });

  // Prepare CSV fields
  const rows = complaints.map((c) => ({
    id: c.id,
    subject: c.subject,
    description: c.description?.replace(/\n/g, " ") || "",
    status: c.status,
    submissionType: c.submissionType,
    userId: c.user?.id || "",
    userName: c.user?.name || "",
    userEmail: c.user?.email || "",
    mediaUrl: c.mediaUrl || "",
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));

  const fields = [
    "id",
    "subject",
    "description",
    "status",
    "submissionType",
    "userId",
    "userName",
    "userEmail",
    "mediaUrl",
    "createdAt",
    "updatedAt",
  ];
  const parser = new Json2CsvParser({ fields });
  const csv = parser.parse(rows);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=complaints_${Date.now()}.csv`);
  return res.send(csv);
});

// export a simple PDF summary (first page header + table first N rows)
const exportPDF = asyncHandler(async (req, res) => {
  const { limit = 200 } = req.query;

  const complaints = await Complaint.findAll({
    include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit, 10),
    raw: true,
    nest: true,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=complaints_report_${Date.now()}.pdf`);

  const doc = new PDFDocument({ margin: 40, size: "A4" });
  doc.pipe(res);

  doc.fontSize(18).text("Complaint Report", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: "right" });
  doc.moveDown();

  // simple summary numbers
  const total = complaints.length;
  doc.fontSize(12).text(`Showing latest ${total} complaints`, { bold: true });
  doc.moveDown(0.5);

  // table-like output (not perfect table, but readable)
  const startY = doc.y;
  complaints.forEach((c, i) => {
    doc.fontSize(10).text(`${i + 1}. [${c.status}] ${c.subject}`, { continued: false });
    doc.fontSize(9).fillColor("gray").text(`   By: ${c.user?.name || "Anonymous"} (${c.user?.email || "N/A"})`, { continued: false });
    doc.fontSize(9).fillColor("black").text(`   Created: ${new Date(c.createdAt).toLocaleString()}`);
    doc.moveDown(0.25);
    // limit length of description
    const desc = (c.description || "").replace(/\s+/g, " ").slice(0, 300);
    doc.fontSize(9).text(`   ${desc}${c.description?.length > 300 ? "..." : ""}`);
    doc.moveDown(0.8);
  });

  doc.end();
});

export { getSummary, exportCSV, exportPDF };
