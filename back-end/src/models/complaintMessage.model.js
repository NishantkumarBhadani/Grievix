import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";
import Complaint from "./complaint.model.js";

const ComplaintMessage=sequelize.define("complaintMessage",{
    message:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
},{timestamps:true})

ComplaintMessage.belongsTo(Complaint,{foreignKey:"complaintId"});
Complaint.hasMany(ComplaintMessage,{foreignKey:"complaintId"});

export default ComplaintMessage;