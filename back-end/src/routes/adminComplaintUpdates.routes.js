import express from 'express';
import { updatecomplaintStatus,addComplaintMessage,getComplaintById } from '../Controllers/adminComplaint.controller.js';
import { verifyJWT,adminAuth } from '../middlewares/auth.middleware.js';
import { Router } from 'express';

const router=Router();

//get a specific complaint
router.route("/:complaintId").get(verifyJWT,adminAuth,getComplaintById);

//update status
router.route("/:complaintId/status").put(verifyJWT,adminAuth,updatecomplaintStatus);

//update message
router.route("/:complaintId/messages").post(verifyJWT,adminAuth,addComplaintMessage);

export default router;