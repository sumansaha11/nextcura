import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets.js';
import axiosInstance from '../utils/axiosInstance.js';
import { AppContext } from '../context/AppContext.jsx';

const Navbar = () => {
    const navigate = useNavigate();
    const cookie = new Cookies();

    const { token, setToken, userData, setUserData } = useContext(AppContext);

    const [showNenu, setShowMenu] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);

    const options = {
        sameSite: 'Strict',
        httpOnly: true,
        path: '/',
    };

    const onLogout = async () => {
        try {
            const response = await axiosInstance.post("/user/logout");

            if (response.data && response.data.data) {
                cookie.remove('accessToken', options);
                cookie.remove('refreshToken', options);
                setUserData(null);
                setToken(false);
                localStorage.setItem('token', false);
                toast.success("User logged out.");
                navigate("/");
            }
        } catch (error) {
            console.log("Error while logging out!");
        }
    };

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
            <h1 onClick={() => { navigate('/') }} className='text-4xl font-semibold text-blue-900 cursor-pointer'>NextCura</h1>
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to='/'>
                    <li className='py-1'>HOME</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/doctors'>
                    <li className='py-1'>ALL DOCTORS</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/about'>
                    <li className='py-1'>ABOUT</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/contact'>
                    <li className='py-1'>CONTACT</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
            </ul>
            <div className='flex items-center gap-4'>
                {
                    token && userData ?
                        <div className='flex items-center gap-2 cursor-pointer relative'>
                            <img onClick={() => setProfileMenu((prev) => !prev)} className='w-10 rounded-full' src={userData.image.url} alt="" />
                            <div className={`${profileMenu ? 'w-full h-96' : 'hidden'} absolute top-0 right-32 pt-14 text-base font-medium text-gray-600 z-20 transition-all`}>
                                <div className='min-w-44 bg bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                    <p onClick={() => {navigate('my-profile'), setProfileMenu(false)}} className='hover:text-black cursor-pointer'>My Profile</p>
                                    <p onClick={() => {navigate('my-appointments'), setProfileMenu(false)}} className='hover:text-black cursor-pointer'>My Appointments</p>
                                    <p onClick={()=>{onLogout(), setProfileMenu(false)}} className='hover:text-black cursor-pointer'>Logout</p>
                                </div>
                            </div>
                        </div>
                        :
                        <button onClick={() => navigate('/login')} className='bg-primary text-white px-6 py-3 rounded-full font-light hidden md:block cursor-pointer'>Create Account</button>
                }

                <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

                <div className={`${showNenu ? 'fixed w-full max-h-96' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white rounded transition-all`}>
                    <div className='flex items-center justify-between px-5 py-6'>
                        <h1 className='text-3xl font-semibold text-blue-900'>NextCura</h1>
                        <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
                    </div>
                    <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                        <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
                    </ul>
                </div>

            </div>
        </div>
    )
};

export default Navbar;