import React from 'react';
import { assets } from '../assets/assets.js';

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-gray-600'>
        <p>CONTACT <span className='text-primary font-semibold'>US</span> </p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>

        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />

        <div className='flex flex-col justify-center items-start gap-6'>
          <div>
            <p className='font-semibold text-lg text-gray-700 py-1'>Our OFFICE</p>
            <p className='text-gray-600 py-1'>54709 Williams Station <br /> Suite 350, Washington, USA</p>
            <p className='text-gray-600 py-1'>Tel: (415) 555-0132 <br /> Email: sumansaha1108@gmail.com</p>
          </div>
          <div>
            <p className='font-semibold text-lg text-gray-700 py-1'>Careers at NEXTCURA</p>
            <p className='text-gray-600 py-1'>Learn more about our teams and job openings.</p>
            <button className='border border-black mt-2 px-8 py-3 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
          </div>
        </div>
      </div>

    </div>
  )
};

export default Contact;