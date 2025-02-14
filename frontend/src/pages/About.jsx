import React from 'react';
import { assets } from '../assets/assets.js';

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-gray-600'>
        <p>ABOUT <span className='text-primary font-semibold'>US</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-700'>
          <p>Welcome to NextCura, your trusted partner in managing your healthcare needs conveniently and efficiently. At NextCura, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
          <p>NextCura is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, NextCura is here to support you every step of the way.</p>
          <div>
            <b className='text-gray-900 text-lg'>Our Vision</b>
            <p className='pt-1'>Our vision at NextCura is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
          </div>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-800 font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border border-white px-10 md:px-16 py-6 sm:py-12 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-700 cursor-pointer'>
          <b>Efficiency:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border border-white px-10 md:px-16 py-6 sm:py-12 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-700 cursor-pointer'>
          <b>Convenience:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border border-white px-10 md:px-16 py-6 sm:py-12 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-700 cursor-pointer'>
          <b>Personalization:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>

    </div>
  )
};

export default About;