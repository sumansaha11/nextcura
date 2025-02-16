import jwt from "jsonwebtoken";
import validator from "validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { razorpayInstance } from "../utils/razorpay.js";
import { userModel } from "../models/user.model.js";
import { doctorModel } from "../models/doctor.model.js";
import { appointmentModel } from "../models/appointment.model.js";

const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None"
};

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens!")
    }
};

const registerUser = asyncHandler(async (req, res) => {

    const { email, name, password } = req.body;

    if (
        [email, name, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required!")
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Enter a valid email!")
    }
    if (password.length < 8) {
        throw new ApiError(400, "Enter a strong password!")
    }

    const existedUser = await userModel.findOne({ email: email.toLowerCase() })
    if (existedUser) {
        throw new ApiError(409, "User with same email already exists!")
    }

    const user = await userModel.create({
        email: email.toLowerCase(),
        name,
        password,
    })

    const createdUser = await userModel.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user!")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: createdUser, accessToken, refreshToken
                },
                "User registered."
            )
        )
});

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required!");
    }

    const user = await userModel.findOne({ email })
    if (!user) {
        throw new ApiError(404, "User with email does not exist!");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials!");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await userModel.findById(user._id).select(
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
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged-in."
            )
        )
});

const logoutUser = asyncHandler(async (req, res) => {

    await userModel.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged-out.")
        )
});

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request!")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await userModel.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token!")
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired!")
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken
                    },
                    "Access token refreshed."
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

});

const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword, confirmPassword } = req.body

    const user = await userModel.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Incorrect password!")
    }

    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password is same as old password!")
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match!")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Password changed.")
        )
});

const getCurrentUser = asyncHandler(async (req, res) => {

    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current user fetched.")
        )
});

const updateAccountDetails = asyncHandler(async (req, res) => {

    const { name, phone, address, dob, gender } = req.body;
    const userId = req.user?._id.toString();

    if (!name || !phone || !dob || !address || !gender) {
        throw new ApiError(400, "Data is missing!")
    }

    const imageLocalPath = req.file?.path;

    const user = await userModel.findByIdAndUpdate(
        userId,
        {
            $set: {
                name,
                phone,
                address: JSON.parse(address),
                dob,
                gender
            }
        },
        { new: true }
    ).select("-password -refreshToken")

    if (imageLocalPath) {
        const image = await uploadOnCloudinary(imageLocalPath, "user");

        const userImage = await userModel.findById(userId).select("image");
        const imageToDelete = userImage.image.public_id;

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    image: {
                        public_id: image.public_id,
                        url: image.url
                    }
                }
            },
            { new: true }
        ).select("-password -refreshToken")

        if (imageToDelete !== "nextcura/user/inykyhi7yhs7ucxosgor" && updatedUser.image.public_id) {
            await deleteOnCloudinary(imageToDelete);
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, updatedUser, "Profile image updated.")
            )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Account details updated.")
        )
});

const listAppointment = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const appointments = await appointmentModel.find({ userId });

    return res
        .status(200)
        .json(
            new ApiResponse(200, appointments, "All appointments fetched.")

        )
});

const bookAppointment = asyncHandler(async (req, res) => {

    const { docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password -refreshToken");
    if (!docData.available) {
        return res
            .status(400)
            .json(
                new ApiResponse(400, "Doctor not available.")
            )
    }

    let slots_booked = docData.slots_booked;

    if (slots_booked[slotDate]) {
        if (slots_booked[slotDate].includes(slotTime)) {
            return res
                .status(400)
                .json(
                    new ApiResponse(400, "Slot not available.")
                )
        } else {
            slots_booked[slotDate].push(slotTime)
        }
    } else {
        slots_booked[slotDate] = []
        slots_booked[slotDate].push(slotTime)
    }

    const userId = req.user?._id;
    const userData = await userModel.findById(userId).select("-password -refreshToken");

    delete docData.slots_booked

    const newAppointment = await appointmentModel.create({
        userId,
        docId,
        userData,
        docData,
        amount: docData.fees,
        slotDate,
        slotTime,
    })

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
            new ApiResponse(200, newAppointment, "Appointment booked.")
        )
});

const paymentRazorpay = asyncHandler(async (req, res) => {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.cancelled) {
        throw new ApiError(400, "Appointment cancelled or not found!");
    }

    const razorpayOptions = {
        amount: appointmentData.amount * 100,
        currency: process.env.CURRENCY,
        receipt: appointmentId
    }

    const order = await razorpayInstance.orders.create(razorpayOptions);

    return res
        .status(200)
        .json(
            new ApiResponse(200, order, "Payment successful.")
        )
});

const verifyRazorpay = asyncHandler(async (req, res) => {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === 'paid') {
        await appointmentModel.findByIdAndUpdate(
            orderInfo.receipt,
            {
                $set: {
                    payment: true
                }
            },
            { new: true }
        )

        return res
            .status(200)
            .json(
                new ApiResponse(200, orderInfo, "Payment successful.")
            )
    } else {
        throw new ApiError(500, "Payment failed!")
    }
})

const cancelAppointment = asyncHandler(async (req, res) => {
    const { appointmentId } = req.body;
    const userId = req.user?._id.toString();

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData.userId !== userId) {
        throw new ApiError(401, "Unauthorized action!")
    }

    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
        appointmentId,
        {
            $set: {
                cancelled: true
            }
        },
        { new: true }
    )

    if (!updatedAppointment) {
        throw new ApiError(500, "Error while cancelling appointment!")
    }

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

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    listAppointment,
    bookAppointment,
    paymentRazorpay,
    verifyRazorpay,
    cancelAppointment
};