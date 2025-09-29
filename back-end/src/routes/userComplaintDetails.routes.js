import { Router } from "express";
import { getComplaintMessages,getComplaintStatus } from "../Controllers/complaintDetails.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

//for status
router.route("/:complaintId/status").get(verifyJWT,getComplaintStatus);

//for message
router.route("/:complaintId/messages").get(verifyJWT,getComplaintMessages);

export default router;