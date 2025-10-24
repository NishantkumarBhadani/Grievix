import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Generation of tokens
const generateToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validatorBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError("Failed in genreating token", 500, error);
  }
};

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !phone || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    where: { email },
  });
  if (existingUser) {
    throw new ApiError(409, "User already exist");
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role:role || "user"
  });

  //creates user for returing purpose removing the password
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, safeUser, "User registered successfully"));
});

//login
const logInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // console.log(req.body);

  if (!email || !password) {
    throw new ApiError("Email and password is required", 400);
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

//   console.log("Stored hash:", user.password);
// console.log("Login password:", password);

  //verifying password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }
  //tokens generations
  const { accessToken, refreshToken } = await generateToken(user);

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: safeUser,
          accessToken,
          refreshToken,
        },
        "Login Successful"
      )
    );
});

//logOut
const logOut=asyncHandler(async(req,res)=>{
    const userId=req.user.id;

    //Find that user
    const user=await User.findByPk(userId);

    if(!user){
        throw new ApiError(404,"User not found");
    }

    //clear token from db
    user.accessToken=null;
    user.refreshToken=null;
    await user.save();

    //clear jwt cookie
    res.clearCookie("accessToken",{httpOnly:true,secure:true})
    res.clearCookie("refreshToken",{httpOnly:true,secure:true})

    return res
    .status(200)
    .json(new ApiResponse(200,null,"Logged out successfully"));
});

export { registerUser, logInUser, logOut };
