import { Router } from "express";
import {
    createAdmin,
    loginAdmin,
    logoutAdmin,
    getCurrentAdmin,
    getAllDoctors,
    addDoctor,
    appointmentsAdmin,
    appointmentCancel,
    adminDashboard
} from "../controllers/admin.controller.js";
import { changeAvailability } from "../controllers/doctor.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/adminAuth.middleware.js";

const adminRouter = Router();

adminRouter.route("/login").post(loginAdmin);

adminRouter.route("/create-admin").post(verifyJWT, createAdmin);
adminRouter.route("/logout").post(verifyJWT, logoutAdmin);
adminRouter.route("/current-admin").get(verifyJWT, getCurrentAdmin);
adminRouter.route("/all-doctors").get(verifyJWT, getAllDoctors);
adminRouter.route("/add-doctor").post(
    verifyJWT,
    upload.single("image"),
    addDoctor
);
adminRouter.route("/appointments").get(verifyJWT, appointmentsAdmin);
adminRouter.route("/cancel-appointments").post(verifyJWT, appointmentCancel);
adminRouter.route("/dashboard").get(verifyJWT, adminDashboard);


adminRouter.route("/change-availability").post(verifyJWT, changeAvailability);

export default adminRouter;