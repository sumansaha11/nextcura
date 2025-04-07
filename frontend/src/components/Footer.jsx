import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
          <h1 className='text-4xl font-semibold text-blue-900 pb-2'>NextCura</h1>
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>Our vision at NextCura is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and doctors, making it easier for you to access the care you need, when you need it.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600 cursor-pointer'>
            <li onClick={() => { navigate('/'), scrollTo(0, 0) }}>Home</li>
            <li onClick={() => { navigate('/about'), scrollTo(0, 0) }}>About us</li>
            <li onClick={() => { navigate('/contact'), scrollTo(0, 0) }}>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+91 9330674624</li>
            <li>sumansaha1108@gmail.com</li>
          </ul>
        </div>
      </div >

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025@ NextCura - All Rights Reserved.</p>
      </div>
    </div >
  )
};

export default Footer;