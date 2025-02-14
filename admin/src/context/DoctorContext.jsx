import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance.js";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const navigate = useNavigate();

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '');
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);
    const [profileData, setProfileData] = useState(false);

    const getDoctorInfo = async () => {
        try {
            const response = await axiosInstance.get("/doctor/current-doctor");
            if (response.data && response.data.data) {
                setDoctorInfo(response.data.data);
            }
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/doctor/login");
            }
        }
    };

    const getAppointments = async () => {
        try {
            const { data } = await axiosInstance.get('/doctor/appointments');
            if (data.success) {
                setAppointments(data.data);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error while fetching appointments!");
        }
    };

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axiosInstance.post('/doctor/complete-appointment', { appointmentId });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            }
        } catch (error) {
            console.log(error);
            toast.error("Error while marking appointment complete!");
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axiosInstance.post('/doctor/cancel-appointment', { appointmentId });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            }
        } catch (error) {
            console.log(error);
            toast.error("Error while cancelling appointment!");
        }
    };

    const getDashData = async () => {
        try {
            const { data } = await axiosInstance.get('/doctor/dashboard');
            if (data.success) {
                setDashData(data.data);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error while fetching dashboard data!");
        }
    };

    const getProfileData = async () => {
        try {
            const { data } = await axiosInstance.get('/doctor/profile');
            if (data.success) {
                setProfileData(data.data);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error while fetching profile!");
        }
    };

    const value = {
        dToken, setDToken,
        doctorInfo, getDoctorInfo,
        appointments, setAppointments, getAppointments,
        completeAppointment,
        cancelAppointment,
        dashData, setDashData, getDashData,
        profileData, setProfileData, getProfileData
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
};

export default DoctorContextProvider;