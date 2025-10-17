import Complaint from "../models/complaint.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.models.js";


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
            
            if(uploaded?.secure_url){
                mediaUrl = uploaded.secure_url;
                // console.log("Media URL:", mediaUrl);
            }
        } catch (error) {
            console.error("Cloudinary upload error:", error);
        }
    } 
    // else {
    //     console.log("No file received in request");
    // }

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
//Get complaints registered by user
const getMyComplaints=asyncHandler(async(req,res)=>{
    const complaints=await Complaint.findAll({
        where:{userId:req.user.id},
        order:[["createdAt","DESC"]]
    })

    res.status(200).json({
        success:true,
        complaints,
    })
})

//getAllComplaints for admin
const getAllComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.findAll({
    include: [
      {
        model: User,
        as: "user", // MUST match the alias used in your association
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    data:complaints,
  });
});

export {createComplaint,getMyComplaints,getAllComplaints};