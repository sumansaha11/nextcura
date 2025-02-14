import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import { AppContext } from '../context/AppContext.jsx';

const Banner = () => {
    const navigate = useNavigate();

    const { userData } = useContext(AppContext);

    return (
        <div className='flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10' >
            <div className='flex-1 py-6 sm:py-8 md:py-12 lg:py-20 lg:pl-5'>
                <div className='text-2xl sm:text-xl md:text-2xl lg:text-4xl font-semibold text-white'>
                    <p>Book Appointment</p>
                    <p className='mt-4'>With 100+ Trusted Doctors</p>
                </div>
                {
                    userData ?
                        <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all'>Browse Doctors</button>
                        :
                        <button onClick={() => { navigate('/login'); scrollTo(0, 0) }} className='bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all'>Create Account</button>
                }
            </div>

            <div className='hidden md:block md:w-1/3 1g:w-[370px] relative'>
                <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt='' />
            </div>
        </div>
    )
};

export default Banner;