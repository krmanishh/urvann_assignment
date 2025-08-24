import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler} from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req, res, next) => 
  {
  try 
  {
  
const authHeader = req.header("Authorization");

const token = req.cookies?.accessToken || (authHeader && authHeader.startsWith("Bearer") ? authHeader.split(" ")[1] : null);

    console.log("🔐 Auth Middleware Debug:");
    console.log("  - Auth Header:", authHeader);
    console.log("  - Extracted Token:", token ? `${token.substring(0, 20)}...` : "No token");
    console.log("  - ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET ? "Present" : "MISSING!");
    console.log("  - REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET ? "Present" : "MISSING!");

    if(!token){
      throw new ApiError(401, "Unauthorized request") 
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      console.error("❌ CRITICAL: ACCESS_TOKEN_SECRET is not defined!");
      throw new ApiError(500, "Server configuration error");
    }
  
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log("✅ Token verified successfully:", decodedToken);
  
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
  
    if(!user){
      throw new ApiError(401, "Invalid Access Token");
    }
  
    req.user = user;
    next()
} catch (error) {
  console.error("❌ JWT Verification Error:", error.message);
  if (error.name === 'JsonWebTokenError') {
    console.error("  - This usually means the token signature is invalid");
    console.error("  - Check if ACCESS_TOKEN_SECRET matches between token generation and verification");
  }
  throw new ApiError(401, error?.message || "Invalid access token") 
}
})

export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  throw new ApiError(403, "Access denied. Admins only.");
};