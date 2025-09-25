import express from 'express';
import {createComplaint,getMyComplaints,getAllComplaints} from "../Controllers/complaint.controller.js"
import {upload} from "../middlewares/multer.middleware.js";
import {verifyJWT,adminAuth} from "../middlewares/auth.middleware.js";
import { Router } from 'express';

const router=Router();

//create Complaint
router.route("/createComplaint").post(verifyJWT,upload.single("media"),createComplaint);

//get my complaints
router.route("/mycomplaints").get(verifyJWT,getMyComplaints);

//get all complaints
router.route("/allcomplaints").get(verifyJWT,adminAuth,getAllComplaints);


export default router;