import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";
import Complaint from "./complaint.model.js";
import User from "./user.models.js";

const Escalation = sequelize.define("Escalation", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  complaintId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Complaint,
      key: "id",
    },
  },
  fromAdminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  authorityName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authorityEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "in_review", "resolved"),
    defaultValue: "pending",
  },
});

Escalation.belongsTo(Complaint, { foreignKey: "complaintId", as: "complaint" });
Escalation.belongsTo(User, { foreignKey: "fromAdminId", as: "fromAdmin" });

export default Escalation;
