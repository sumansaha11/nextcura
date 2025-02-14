import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance.js";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const navigate = useNavigate();

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
    const [adminInfo, setAdminInfo] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);

    const getAdminInfo = async () => {
        try {
            const response = await axiosInstance.get("/admin/current-admin");
            if (response.data && response.data.data) {
                setAdminInfo(response.data.data);
            }
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/admin/login");
            }
        }
    };

    const getAllDoctors = async () => {
        try {
            const { data } = await axiosInstance.get('/admin/all-doctors');
            if (data.success) {
                setDoctors(data.data);
            }
        } catch (error) {
            toast.error('Error while fetching doctors');
        }
    };

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axiosInstance.post('/admin/change-availability', { docId });
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            }
        } catch (error) {
            toast.error('Error while updating availability!');
        }
    };

    const getAllAppointments = async () => {
        try {
            const { data } = await axiosInstance.get('/admin/appointments');
            if (data.success) {
                setAppointments(data.data);
            }
        } catch (error) {
            toast.error('Error while fetching appointments!');
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axiosInstance.post('/admin/cancel-appointments', { appointmentId });
            if (data.success) {
                toast.success(data.message);
                getAllAppointments();
            }
        } catch (error) {
            toast.error('Error while cancelling appointment!');
            console.log(error);

        }
    };

    const getDashData = async () => {
        try {
            const { data } = await axiosInstance.get('/admin/dashboard');
            if (data.success) {
                setDashData(data.data);
            }
        } catch (error) {
            toast.error("Error while fetching Dashboard data!");
            console.log(error);
        }
    };

    const value = {
        aToken, setAToken,
        adminInfo, getAdminInfo,
        doctors, getAllDoctors,
        changeAvailability,
        appointments, setAppointments, getAllAppointments,
        cancelAppointment,
        dashData, getDashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
};

export default AdminContextProvider;