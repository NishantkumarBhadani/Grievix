import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";
import User from "./user.models.js";

const Complaint = sequelize.define("Complaint", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  submissionType: {
    type: DataTypes.ENUM("public", "anonymous"), 
    allowNull: false,
  },

  subject: {
    type: DataTypes.STRING,  
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,   
    allowNull: false,
  },

  mediaUrl: {
    type: DataTypes.STRING, 
    allowNull: true,
  },

  status: {
    type: DataTypes.ENUM("pending", "in_progress", "resolved"), 
    defaultValue: "pending",
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,         
  },
});

Complaint.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Complaint;
