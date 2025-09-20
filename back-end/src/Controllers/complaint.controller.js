import Complaint from "../models/complaint.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

//Create Complaint
const createComplaint= asyncHandler(async(req,res)=>{
    const {submissionType, subject, description} =req.body;
    let mediaUrl=null;
      if(req.file){
        // console.log("File received:", req.file);
        // console.log("File path:", req.file.path);
        
        try {
            const uploaded = await uploadOnCloudinary(req.file.path);
            console.log("Cloudinary response:", uploaded);
            
            if(uploaded){
                mediaUrl = uploaded.secure_url;
                // console.log("Media URL:", mediaUrl);
            }
        } catch (error) {
            console.error("Cloudinary upload error:", error);
        }
    } else {
        console.log("No file received in request");
    }

    //user_id for public and anonyms
    const userId=submissionType==="anonymous" ? null :req.user?.id;

    //complain creatton
    const complaint=await Complaint.create({
        submissionType,
        subject,
        description,
        mediaUrl,
        userId
    })

    if(!complaint){
        throw new ApiError(500,"Something went wrong");
    }

    res.status(201).json({
        success:true,
        message:"Complaint registered successfully",
        complaint
    })
})

export {createComplaint};