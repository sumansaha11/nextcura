import { Router } from "express";
import { verifyJWT } from "../middlewares/doctorAuth.middleware.js";
import {
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
} from "../controllers/doctor.controller.js";

const doctorRouter = Router();

doctorRouter.route("/list").get(doctorList);
doctorRouter.route("/login").post(loginDoctor);

doctorRouter.route("/logout").post(verifyJWT, logoutDoctor);
doctorRouter.route("/current-doctor").get(verifyJWT, getCurrentDoctor);
doctorRouter.route("/appointments").get(verifyJWT, appointmentsDoctor);
doctorRouter.route("/complete-appointment").post(verifyJWT, appointmentComplete);
doctorRouter.route("/cancel-appointment").post(verifyJWT, appointmentCancel);
doctorRouter.route("/dashboard").get(verifyJWT, doctorDashboard);
doctorRouter.route("/profile").get(verifyJWT, doctorProfile);
doctorRouter.route("/update-profile").post(verifyJWT, updateDoctorProfile);

export default doctorRouter;