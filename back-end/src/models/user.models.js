import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const User=sequelize.define(
    "User",
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
            validate:{
                isEmail:true,
            }
        },
        phone:{
            type:DataTypes.INTEGER,
            allowNull:false,
            unique:true,
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        role:{
            type:DataTypes.ENUM("user","admin"),
            defaultValue:"user",
        }
    },
    {
        timestamps:true,
    }
);

export default User;