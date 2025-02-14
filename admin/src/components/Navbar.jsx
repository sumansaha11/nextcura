import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Cookies } from 'react-cookie';
import axiosInstance from '../utils/axiosInstance.js';
import { AdminContext } from '../context/AdminContext.jsx';
import { DoctorContext } from '../context/DoctorContext.jsx';

const Navbar = () => {
    const cookie = new Cookies();
    const navigate = useNavigate();

    const { aToken, setAToken } = useContext(AdminContext);
    const { dToken, setDToken } = useContext(DoctorContext);

    const loggedIn = localStorage.getItem('logged');
    const user = localStorage.getItem('aToken') || localStorage.getItem('dToken');

    const options = {
        sameSite: 'Strict',
        path: '/',
        httpOnly: true,
    };

    const logout = async () => {
        try {
            const response = await axiosInstance.post(`/${user}/logout`);

            if (response.data && response.data.data) {
                cookie.remove('accessToken', options);
                cookie.remove('refreshToken', options);
                if (user === 'Admin') {
                    localStorage.removeItem('aToken');
                } else {
                    localStorage.removeItem('dToken');
                }
                localStorage.removeItem('logged');
                aToken && setAToken('');
                dToken && setDToken('');
                toast.success(response.data.message);
                navigate(`/${user}/login`);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error while logging out!");
        }
    };

    return (
        <div className='bg-blue-400 flex items-center justify-between px-4 sm:px-10 py-3'>
            <div className='flex items-center gap-2 text-xs'>
                <h1 onClick={() => navigate('/admin/dashboard')} className='text-4xl font-semibold text-blue-900 cursor-pointer'>NextCura</h1>
                <p className='mt-3 border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-700'>{user}</p>
            </div>
            {
                loggedIn ?
                    <button onClick={logout} className='bg-blue-800 text-white text-sm px-10 py-2 rounded-full cursor-pointer'>Logout</button>
                    :
                    <></>
            }
        </div>
    )
};

export default Navbar;