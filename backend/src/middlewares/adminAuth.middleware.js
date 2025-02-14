import JWT from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { adminModel } from '../models/admin.model.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!accessToken) {
            throw new ApiError(401, "Unauthorized request!");
        }

        const decodedToken = JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const admin = await adminModel.findById(decodedToken?._id).select("-password -refreshToken");
        if (!admin) {
            throw new ApiError(401, "Invalid access token!");
        }

        req.user = admin;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token!");
    }
});