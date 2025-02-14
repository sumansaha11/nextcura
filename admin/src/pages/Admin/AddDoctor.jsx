import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets.js';
import axiosInstance from '../../utils/axiosInstance.js';
import { AdminContext } from '../../context/AdminContext.jsx';

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [phone, setPhone] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [about, setAbout] = useState('');

  
  const { getAdminInfo } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error('Please upload doctor image!');
      }

      const formData = new FormData();
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('phone', phone);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));
      formData.append('about', about);

      const response = await axiosInstance.post('/admin/add-doctor', formData);

      if (response.data && response.data.data) {
        toast.success(response.data.message);
        setDocImg(false);
        setName('');
        setEmail('');
        setPassword('');
        setExperience('1 Year');
        setFees('');
        setPhone('');
        setSpeciality('General physician');
        setDegree('');
        setAddress1('');
        setAddress2('');
        setAbout('');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error while adding doctor!');
    }
  };

  useEffect(() => {
    getAdminInfo();
  }, []);

  return (
    <div className='w-full max-w-6xl m-5 max-h-[80vh] overflow-y-scroll'>
      <form onSubmit={onSubmitHandler} className='m-5 w-full'>

        <p className='mb-3 text-lg font-medium'>Add Doctor</p>

        <div className='bg-white px-8 py-8 rounded w-full max-w-4xl'>
          <div className='flex items-center gap-4 mb-8 text-gray-500'>
            <label htmlFor="doc-img">
              <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
            </label>
            <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
            <p>Upload doctor <br /> picture</p>
          </div>

          <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
            <div className='w-full lg:flex-1 flex flex-col gap-4'>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Doctor name</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Doctor Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Doctor Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Experience</p>
                <select onChange={(e) => setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2' name="" id="experience">
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3 Years">3 Years</option>
                  <option value="4 Years">4 Years</option>
                  <option value="5 Years">5 Years</option>
                  <option value="6 Years">6 Years</option>
                  <option value="7 Years">7 Years</option>
                  <option value="8 Years">8 Years</option>
                  <option value="9 Years">9 Years</option>
                  <option value="10 Years">10 Years</option>
                </select>
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Fees</p>
                <input onChange={(e) => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Fees' required />
              </div>
            </div>

            <div className='w-full lg:flex-1 flex flex-col gap-4'>
              <div className='flex-1 flex flex-col gap-1'>
                <p>Phone</p>
                <input onChange={(e) => setPhone(e.target.value)} value={phone} className='border rounded px-3 py-2' type="text" placeholder='Phone number' required />
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Speciality</p>
                <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2' name="" id="speciality">
                  <option value="General Physician">General Physician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatricians">Pediatricians</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="6 Years">Gastroenterologist</option>
                </select>
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Education</p>
                <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder='Education' required />
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Address</p>
                <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Line 1' required />
                <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Line 2' required />
              </div>
            </div>
          </div>

          <div>
            <p className='mt-4 mb-2'>About</p>
            <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='About Doctor' rows={5} required />
          </div>

          <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add Doctor</button>
        </div>
      </form>
    </div>
  )
};

export default AddDoctor;