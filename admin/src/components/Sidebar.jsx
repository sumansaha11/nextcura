import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import { AdminContext } from '../context/AdminContext.jsx';
import { DoctorContext } from '../context/DoctorContext.jsx';

const Sidebar = () => {

    const loggedIn = localStorage.getItem('logged');

    const { aToken } = useContext(AdminContext);
    const { dToken } = useContext(DoctorContext);

    return loggedIn && (
        <div className='md:min-h-[90vh] bg-white'>
            {
                aToken && <ul className='text-[#515151] mt-5'>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-gray-200 border-r-4 border-primary' : ''}`} to={'/admin/dashboard'}>
                        <img src={assets.home_icon} alt="" />
                        <p className='hidden md:block'>Dashboard</p>
                    </NavLink>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-gray-200 border-r-4 border-primary' : ''}`} to={'/admin/all-appointments'}>
                        <img src={assets.appointment_icon} alt="" />
                        <p className='hidden md:block'>Appointments</p>
                    </NavLink>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-gray-200 border-r-4 border-primary' : ''}`} to={'/admin/add-doctor'}>
                        <img src={assets.add_icon} alt="" />
                        <p className='hidden md:block'>Add Doctors</p>
                    </NavLink>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-gray-200 border-r-4 border-primary' : ''}`} to={'/admin/doctors-list'}>
                        <img src={assets.people_icon} alt="" />
                        <p className='hidden md:block'>Doctors List</p>
                    </NavLink>
                </ul>
            }
            {
                dToken && <ul className='text-[#515151] mt-5'>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-gray-200 border-r-4 border-primary' : ''}`} to={'/doctor/dashboard'}>
                        <img src={assets.home_icon} alt="" />
                        <p className='hidden md:block'>Dashboard</p>
                    </NavLink>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-gray-200 border-r-4 border-primary' : ''}`} to={'/doctor/appointments'}>
                        <img src={assets.appointment_icon} alt="" />
                        <p className='hidden md:block'>Appointments</p>
                    </NavLink>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-gray-200 border-r-4 border-primary' : ''}`} to={'/doctor/profile'}>
                        <img src={assets.people_icon} alt="" />
                        <p className='hidden md:block'>Profile</p>
                    </NavLink>
                </ul>
            }
        </div>
    )
};

export default Sidebar;