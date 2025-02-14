import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance.js';
import { AdminContext } from '../context/AdminContext.jsx';
import { DoctorContext } from '../context/DoctorContext.jsx';

const Login = () => {
    const navigate = useNavigate();
    
    const [state, setState] = useState('Doctor');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { setAToken } = useContext(AdminContext);
    const { setDToken } = useContext(DoctorContext);
    
    const user = state;

    const handleStateChange = () => {
        if (state === 'Admin') {
            navigate('/admin/login');
        } else if (state === 'Doctor') {
            navigate('/doctor/login');
        }
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (state === 'Admin') {
                const response = await axiosInstance.post("/admin/login",
                    {
                        email: email,
                        password: password,
                    },
                    {
                        withCredentials: true
                    }
                );

                if (response.data && response.data.data && response.data.data.accessToken) {
                    toast.success(response.data.message);
                    setAToken('admin');
                    localStorage.setItem('aToken', 'Admin');
                    navigate('/admin/dashboard');
                }
            } else {
                const response = await axiosInstance.post("/doctor/login",
                    {
                        email: email,
                        password: password,
                    },
                    {
                        withCredentials: true
                    }
                );

                if (response.data && response.data.data && response.data.data.accessToken) {
                    toast.success(response.data.message);
                    setDToken('doctor');
                    localStorage.setItem('dToken', 'Doctor');
                    navigate('/doctor/dashboard');
                }
            }
            localStorage.setItem('logged', true);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Invalid login credentials!";
            toast.error(errorMessage);
        }
    }

    useEffect(() => {
        handleStateChange();
    }, [state]);

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-white'>
                <p className='text-2xl font-semibold m-auto'><span className='text-primary'> {user} </span> Login</p>
                <div className='w-full'>
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
                </div >
                <div className='w-full'>
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
                </div>
                <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
                {
                    state === 'Admin'
                        ? <p>Doctor Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Doctor')}>Click here</span></p>
                        : <p>Admin Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Admin')}>Click here</span></p>
                }
            </div >
        </form >
    )
};

export default Login;