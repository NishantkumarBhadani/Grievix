// src/routes/report.routes.js
import express from "express";
import { getSummary, exportCSV, exportPDF} from "../Controllers/report.controller.js"
import { verifyJWT, adminAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes protected for admins
router.get("/summary", verifyJWT, adminAuth, getSummary);
router.get("/export/csv", verifyJWT, adminAuth, exportCSV);
router.get("/export/pdf", verifyJWT, adminAuth, exportPDF);

export default router;
