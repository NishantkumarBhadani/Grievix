import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.models.js";

// ✅ Verify JWT middleware
const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Access token missing");
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password", "refreshToken"] },
    });

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user; // attach user
    next();
  } catch (err) {
    next(new ApiError(401, "Unauthorized", err.message));
  }
};

// ✅ Admin auth middleware
const adminAuth = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Access denied: Admins only");
  }

  next();
};

export { verifyJWT, adminAuth };
