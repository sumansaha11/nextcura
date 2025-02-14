import { createContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from "../utils/axiosInstance.js";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const navigate = useNavigate();

    const currencySymbol = '₹';

    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
    const [userData, setUserData] = useState(false);
    const [doctors, setDoctors] = useState([]);

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/user/current-user');
            if (response.data && response.data.data) {
                setUserData(response.data.data);
            }
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/");
            }
        }
    }

    const getDoctorsData = async () => {
        try {
            const { data } = await axiosInstance.get('/doctor/list');
            if (data.success) {
                setDoctors(data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch doctor data!");
            console.log(error);
        }
    }

    const value = {
        token, setToken,
        userData, setUserData, getUserInfo,
        currencySymbol,
        doctors, getDoctorsData,
    }

    useEffect(() => {
        getDoctorsData();
    }, [])

    useEffect(() => {
        if (token) {
            getUserInfo();
        } else {
            setUserData(false);
        }
    }, [token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;