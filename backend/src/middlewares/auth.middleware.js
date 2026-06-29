import { User } from "../models/user.model.js";
import { Otp } from "../models/otp.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const getUser = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (token) {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    req.user = user;
  } else {
    req.user = null;
  }
  next();
});

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const verifyAdmin = asyncHandler(async (req, _, next) => {
  try {
    if (req.user.userType !== "Admin" && req.user.userType !== "SuperAdmin") {
      throw new ApiError(403, "Unauthorized request || For Admin Only.");
    }
    next();
  } catch (error) {
    throw new ApiError(403, error?.message || "Unauthorized request");
  }
});

export const verifySuperAdmin = asyncHandler(async (req, _, next) => {
  try {
    if (req.user.userType !== "SuperAdmin") {
      throw new ApiError(403, "Unauthorized request || For SuperAdmin Only.");
    }
    next();
  } catch (error) {
    throw new ApiError(403, error?.message || "Unauthorized request");
  }
});

export const verifyOtp = asyncHandler(async (req, _, next) => {
  try {
    const { identifier, otp } = req.body;
    const response = await Otp.find({ identifier: identifier })
      .sort({ createdAt: -1 })
      .limit(1);

    if (response.length === 0 || otp != response[0].otp) {
      throw new ApiError(409, "Invalid OTP");
    }
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid OTP");
  }
});
