import { Router } from "express";
import { escalteComplaint,getAllEscalations } from "../Controllers/escalation.controller.js";
import { verifyJWT,adminAuth } from "../middlewares/auth.middleware.js";

const router=Router();

//esclate complaint
router.route("/:complaintId/createscalate").post(verifyJWT,adminAuth,escalteComplaint);

//get all escalated complaints
router.route("/getallescalate").post(verifyJWT,adminAuth,getAllEscalations);

export default router;