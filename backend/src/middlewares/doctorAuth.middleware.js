import JWT from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { doctorModel } from '../models/doctor.model.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!accessToken) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const doctor = await doctorModel.findById(decodedToken?._id).select("-password -refreshToken");

        if (!doctor) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = doctor;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});