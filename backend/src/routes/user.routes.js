import { Router } from "express";
import {
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
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/userAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);

//secured routes
userRouter.route("/current-user").get(verifyJWT, getCurrentUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword);
userRouter.route("/update-profile").patch(upload.single("image"), verifyJWT, updateAccountDetails);
userRouter.route("/appointments").get(verifyJWT, listAppointment);
userRouter.route("/book-appointment").post(verifyJWT, bookAppointment);
userRouter.route("/payment-razorpay").post(verifyJWT, paymentRazorpay);
userRouter.route("/verify-razorpay").post(verifyJWT, verifyRazorpay);
userRouter.route("/cancel-appointment").post(verifyJWT, cancelAppointment);

export default userRouter;