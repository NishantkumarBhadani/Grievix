import Complaint from "../models/complaint.model.js"
import ComplaintMessage from "../models/complaintMessage.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

//get complaint staus
const getComplaintStatus=asyncHandler(async(req,res)=>{
    const {complaintId}=req.params;

    const complaint=await Complaint.findByPk(complaintId,{
        attributes:["id","status"],
        where:{userId:req.user.id},
    })

    if(!complaint){
        throw new ApiError(404,"Complaint not found");
    }

    res.status(200).
    json(new ApiResponse(200,complaint,"Complaint status fetched successfully"))
})
//get complaint updates

const getComplaintMessages = asyncHandler(async (req, res) => {
  const { complaintId } = req.params;

  // Check if complaint belongs to user
  const complaint = await Complaint.findByPk(complaintId);
  if (!complaint || complaint.userId !== req.user.id) {
    throw new ApiError(404, "Complaint not found or not authorized");
  }

  const messages = await ComplaintMessage.findAll({
    where: { complaintId },
    order: [["createdAt", "ASC"]],
  });

  res.status(200).json(
    new ApiResponse(200, messages, "Complaint messages fetched successfully")
  );
});

export { getComplaintStatus, getComplaintMessages };
