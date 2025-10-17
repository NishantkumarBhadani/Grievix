import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Complaint from "../models/complaint.model.js";
import User from "../models/user.models.js";
import Escalation from "../models/esclation.model.js";
import { sendEmail } from "../utils/sendEmail.js";

const escalteComplaint = asyncHandler(async (req, res) => {
const {complaintId}=req.params;
  const {authorityName, authorityEmail, reason } = req.body;
  const fromAdminId = req.user.id;

  //validation of the complaint
  const complaint = await Complaint.findByPk(complaintId, {
    include: { model: User, as: "user" },
  });

  //debugging
  console.log("Complaint ID from request params:", complaintId);

  console.log("Fetched complaint:", complaint);


  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  //create esclation
  const escalation = await Escalation.create({
    complaintId,
    fromAdminId,
    authorityName,
    authorityEmail,
    reason,
  });
  await complaint.update({ status: "in_progress" });

  //Notify the respected authority
  await sendEmail({
    to: authorityEmail,
    subject: `Complaint Escalation :${Complaint.subject}`,
    html: `
            <h3>New Complaint Escalated to You</h3>
            <p><b>Complaint ID:</b> ${complaint.id}</p>
            <p><b>Subject:</b> ${complaint.subject}</p>
            <p><b>Description:</b> ${complaint.description}</p>
            <p><b>Escalated By:</b> Admin ID ${fromAdminId}</p>
            <p><b>Reason:</b> ${reason || "Not specified"}</p>
            <p>Please take necessary action on this complaint.</p>
        `,
  });

  //Notify to user
  if(complaint.user && complaint.user.email){
    await sendEmail({
        to:complaint.user.email,
        subject:"Your Complaint has beed Esclated",
        html:`
             <h3>Dear ${complaint.user.name || "User"},</h3>
             <p>Your complaint (<b>${complaint.subject}</b>) has been escalated to <b>${authorityName}</b> for further action.</p>
            <p>We appreciate your patience while it’s being reviewed.</p>
            <p>Regards,<br>Complaint Management Team</p>
        `,
    })
  }

  return res
  .status(200)
  .json(new ApiResponse(201,escalation,"Complaint esclated successfully"))

});

//get all escalted complaints
const getAllEscalations = asyncHandler(async (req, res) => {
  const escalations = await Escalation.findAll({
    include: [
      { model: Complaint, as: "complaint" },
      { model: User, as: "fromAdmin", attributes: ["id", "name", "email"] },
    ],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, escalations, "Escalations fetched successfully"));
});

export {escalteComplaint,getAllEscalations}
