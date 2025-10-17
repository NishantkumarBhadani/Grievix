import Complaint from "../models/complaint.model.js";
import ComplaintMessage from "../models/complaintMessage.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.models.js";

//getcomplaint
const getComplaintById = asyncHandler(async (req, res) => {
  const { complaintId } = req.params;

  const complaint = await Complaint.findByPk(complaintId, {
    include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
  });

  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  res.status(200).json({
    success: true,
    data: complaint,
  });
});

//Admin updates status of the complaint
const updatecomplaintStatus=asyncHandler(async(req,res)=>{
    const {complaintId} =req.params;
    const {status}=req.body;

    const complaint=await Complaint.findByPk(complaintId);
    if(!complaint){
        throw new ApiError(404, "Complaint not found");
    }
    complaint.status=status;
    await complaint.save();

    res.status(200)
    .json(new ApiResponse(200,complaint,"Complaint Status updated successfully"));
}) 

//Admin adding message for the complaints
const addComplaintMessage=asyncHandler(async(req,res)=>{
    const {complaintId}=req.params;
    const {message}=req.body;

    const complaint=await Complaint.findByPk(complaintId);
    if(!complaint){
        throw new ApiError(404,"complaint not found");
    }
    //Adding updates
    const newMessage=await ComplaintMessage.create({
        complaintId,
        message,
    });

    res.status(200)
    .json(new ApiResponse(200,newMessage,"Message added successfully"))
})

export {updatecomplaintStatus,addComplaintMessage,getComplaintById}