import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { doctorModel } from "../models/doctor.model.js";
import { appointmentModel } from "../models/appointment.model.js";

const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None"
};

const generateAccessAndRefreshTokens = async (doctorId) => {
    try {
        const doctor = await doctorModel.findById(doctorId)
        const accessToken = await doctor.generateAccessToken()
        const refreshToken = await doctor.generateRefreshToken()

        doctor.refreshToken = refreshToken
        await doctor.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens!")
    }
};

const changeAvailability = asyncHandler(async (req, res) => {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    let doctor = await doctorModel.findByIdAndUpdate(
        docId,
        {
            available: !docData.available
        },
        { new: true }
    ).select("-password -refreshToken");

    if (!doctor) {
        throw new ApiError(500, "Something went wrong while updating doctor availability!");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, doctor, "Doctor availability updated.")
        )
});

const doctorList = asyncHandler(async (req, res) => {
    const doctors = await doctorModel.find({}).select("-email -password -refreshToken");
    if (!doctors) {
        throw new ApiError(500, "Something went wrong while fetching list of doctors!");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, doctors, "List of doctors fetched.")
        )
});

const loginDoctor = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required!");
    }

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
        throw new ApiError(404, "Doctor with email does not exist!");
    }

    const isPasswordValid = await doctor.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid admin credentials!");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(doctor._id)

    const loggedInDoctor = await doctorModel.findById(doctor._id).select(
        "-password -refreshToken"
    )

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    admin: loggedInDoctor, accessToken, refreshToken
                },
                "Doctor logged-in."
            )
        )
});

const logoutDoctor = asyncHandler(async (req, res) => {

    await doctorModel.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "Doctor logged-out.")
        )
});

const getCurrentDoctor = asyncHandler(async (req, res) => {

    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current doctor fetched.")
        )
});

const appointmentsDoctor = asyncHandler(async (req, res) => {
    const docId = req.user?._id;

    const appointments = await appointmentModel.find({ docId });

    return res
        .status(200)
        .json(
            new ApiResponse(200, appointments, "Doctor appointments fetched.")
        )
});

const appointmentComplete = asyncHandler(async (req, res) => {
    const { appointmentId } = req.body;
    const docId = req.user?._id.toString();

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
        await appointmentModel.findByIdAndUpdate(
            appointmentId,
            {
                $set: {
                    isCompleted: true
                }
            },
            { new: true }
        )
    } else {
        throw new ApiError(401, "Mark failed!")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Appointment completed.")
        )
});

const appointmentCancel = asyncHandler(async (req, res) => {
    const { appointmentId } = req.body;
    const docId = req.user?._id.toString();

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
        await appointmentModel.findByIdAndUpdate(
            appointmentId,
            {
                $set: {
                    cancelled: true
                }
            },
            { new: true }
        )
    } else {
        throw new ApiError(401, "Cancellation failed!")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Appointment cancelled.")
        )
});

const doctorDashboard = asyncHandler(async (req, res) => {
    const docId = req.user?._id;

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;

    appointments.map((item) => {
        if (item.isCompleted || item.payment) {
            earnings += item.amount
        }
    })

    let patients = [];

    appointments.map((item) => {
        if (!patients.includes(item.userId)) {
            patients.push(item.userId)
        }
    })

    const dashData = {
        earnings,
        appointments: appointments.length,
        patients: patients.length,
        latestAppointments: appointments.reverse().slice(0, 5)
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, dashData, "Dashboard data fetched.")
        )
});

const doctorProfile = asyncHandler(async (req, res) => {

    const docId = req.user?._id;
    const profileData = await doctorModel.findById(docId).select("-password -refreshToken");

    return res
        .status(200)
        .json(
            new ApiResponse(200, profileData, "Doctor profile fetched.")
        )
});

const updateDoctorProfile = asyncHandler(async (req, res) => {

    const { fees, address, available } = req.body;
    const docId = req.user?._id.toString();

    const updatedDoctor = await doctorModel.findByIdAndUpdate(
        docId,
        {
            $set: {
                fees,
                address,
                available
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedDoctor, "Profile updated.")
        )
});

export {
    changeAvailability,
    doctorList,
    loginDoctor,
    logoutDoctor,
    getCurrentDoctor,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile
}