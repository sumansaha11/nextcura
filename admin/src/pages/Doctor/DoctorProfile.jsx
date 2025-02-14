import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance.js';
import { AppContext } from '../../context/AppContext.jsx';
import { DoctorContext } from '../../context/DoctorContext.jsx';

const DoctorProfile = () => {

  const { dToken, getDoctorInfo, profileData, setProfileData, getProfileData } = useContext(DoctorContext);
  const { currencySymbol } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address, fees: profileData.fees,
        available: profileData.available
      }

      const { data } = await axiosInstance.post('/doctor/update-profile', updateData)
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      }
    } catch (error) {
      toast.error("Error while updating profile!");
      console.log(error);
    }
  }

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  useEffect(() => {
    getDoctorInfo()
  }, [])

  return profileData && (
    <div className='w-full max-w-6xl m-5 max-h-[80vh] overflow-y-scroll'>
      <div className='flex flex-col gap-4 m-5'>

        <div>
          <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image.url} alt="" />
        </div>

        <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>

          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
          <div className='flex items-center gap-2 mt-1 text-gray-600'>

            <p>{profileData.degree} - {profileData.speciality} </p>

            <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>

          </div>

          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{profileData.about}</p>
          </div>

          <p className='text-gray-600 font-medium mt-4'>
            Appointment fee: <span className='text-gray-800'>{currencySymbol}
              {isEdit ? <input  className='border' type='number' onChange={(e) => { setProfileData(prev => ({ ...prev, fees: e.target.value })) }} value={profileData.fees} /> : profileData.fees}</span>
          </p>

          <div className='flex gap-2 py-2'>
            <p>Address:</p>
            <p className='text-sm'>
              {isEdit ? <input className='border my-1' type="text" onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} /> : profileData.address.line1}
              <br />
              {isEdit ? <input className='border' type="text" onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address.line2} /> : profileData.address.line2}
            </p>
          </div>

          <div className='flex gap-1 pt-1'>
            <input onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} type="checkbox" />
            <label htmlFor="">Available</label>
          </div>

          {
            isEdit ?
              <button onClick={updateProfile} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Save</button>
              :
              <button onClick={() => setIsEdit(true)} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Edit</button>
          }
        </div>

      </div>

    </div >
  )
};

export default DoctorProfile;