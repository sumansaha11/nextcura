import validator from "validator";
import jwt from 'jsonwebtoken';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { adminModel } from "../models/admin.model.js";
import { doctorModel } from "../models/doctor.model.js";
import { userModel } from "../models/user.model.js";
import { appointmentModel } from "../models/appointment.model.js";

const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict"
};

const generateAccessAndRefreshTokens = async (adminId) => {
    try {
        const admin = await adminModel.findById(adminId)
        const accessToken = await admin.generateAccessToken()
        const refreshToken = await admin.generateRefreshToken()

        admin.refreshToken = refreshToken
        await admin.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens!")
    }
};

const createAdmin = asyncHandler(async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (
        [name, email, phone, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required!");
    }

    const existedAdmin = await adminModel.findOne({
        $or: [{ phone }, { email: email.toLowerCase() }]
    })
    if (existedAdmin) {
        throw new ApiError(409, "Admin with same email or phone already exists!");
    }

    const admin = await adminModel.create({
        name,
        email: email.toLowerCase(),
        phone,
        password,
    });

    const createdAdmin = await adminModel.findById(admin._id).select(
        "-password -refreshToken"
    )

    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while creating the Admin!");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdAdmin, "Admin created.")
        )
})

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required!");
    }

    const admin = await adminModel.findOne({ email });
    if (!admin) {
        throw new ApiError(404, "Admin with email does not exist!");
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid admin credentials!");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(admin._id)

    const loggedInAdmin = await adminModel.findById(admin._id).select(
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
                    admin: loggedInAdmin, accessToken, refreshToken
                },
                "Admin logged-in."
            )
        )
});

const logoutAdmin = asyncHandler(async (req, res) => {

    await adminModel.findByIdAndUpdate(
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
            new ApiResponse(200, {}, "Admin logged-out.")
        )
});

const getCurrentAdmin = asyncHandler(async (req, res) => {

    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current admin fetched.")
        )
});

const getAllDoctors = asyncHandler(async (req, res) => {
    const doctors = await doctorModel.find({}).select("-password -refreshToken");
    if (!doctors) {
        throw new ApiError(500, "Doctors not found!");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, doctors, "All doctors fetched.")
        )
})

const addDoctor = asyncHandler(async (req, res) => {

    const { name, email, password, phone, speciality, degree, experience, about, fees, address } = req.body;

    if (
        [email, name, password, phone, speciality, degree, experience, about, fees, address].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required!")
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Enter a valid email!")
    }
    if (password.length < 8) {
        throw new ApiError(400, "Enter a strong password!")
    }

    const existedDoctor = await doctorModel.findOne({ email: email.toLowerCase() })
    if (existedDoctor) {
        throw new ApiError(409, "Doctor with same email already exists!")
    }

    const imageLocalPath = await req.file?.path;
    if (!imageLocalPath) {
        throw new ApiError(400, "Image is missing!");
    }

    const image = await uploadOnCloudinary(imageLocalPath, "doctor");
    if (!image) {
        throw new ApiError(400, "Image is required!");
    }

    const doctor = await doctorModel.create({
        email: email.toLowerCase(),
        name,
        password,
        image: {
            public_id: image.public_id,
            url: image.url
        },
        phone,
        speciality,
        degree,
        experience,
        about,
        fees,
        address: JSON.parse(address)
    })

    const createdDoctor = await doctorModel.findById(doctor._id).select("-password -refreshToken")
    if (!createdDoctor) {
        throw new ApiError(500, "Something went wrong while creating the doctor!")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdDoctor, "Doctor registered.")
        )
});

const appointmentsAdmin = asyncHandler(async (req, res) => {
    const appointments = await appointmentModel.find({});

    return res
        .status(200)
        .json(
            new ApiResponse(200, appointments, "All appointments fetched.")
        )
})

const appointmentCancel = asyncHandler(async (req, res) => {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
        appointmentId,
        {
            $set: {
                cancelled: true
            }
        },
        { new: true }
    )

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(
        docId,
        {
            $set: {
                slots_booked
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedAppointment, "Appointment cancelled.")
        )
});

const adminDashboard = asyncHandler(async (req, res) => {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
        doctors: doctors.length,
        appointments: appointments.length,
        patients: users.length,
        latestAppointments: appointments.reverse().slice(0, 5)
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, dashData, "Dashboard data fetched.")
        )
})

export {
    createAdmin,
    loginAdmin,
    logoutAdmin,
    getCurrentAdmin,
    getAllDoctors,
    addDoctor,
    appointmentsAdmin,
    appointmentCancel,
    adminDashboard
}