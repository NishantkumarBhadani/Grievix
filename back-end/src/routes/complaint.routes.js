import express from 'express';
import {createComplaint} from "../Controllers/complaint.controller.js"
import {upload} from "../middlewares/multer.middleware.js";
import {verifyJWT,adminAuth} from "../middlewares/auth.middleware.js";
import { Router } from 'express';

const router=Router();

//create Complaint
router.route("/createComplaint").post(verifyJWT,upload.single("media"),createComplaint)

export default router;