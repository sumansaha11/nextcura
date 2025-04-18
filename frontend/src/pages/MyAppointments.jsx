import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';
import axiosInstance from '../utils/axiosInstance.js';

const MyAppointments = () => {
  const navigate = useNavigate();

  const { token } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [filterOption, setFilterOption] = useState("All");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2];
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axiosInstance.get('/user/appointments');
      if (data.success) {
        setAppointments(data.data.reverse());
        return data.data;
      }
    } catch (error) {
      console.log(error);
      toast.error('Error while fetching appointments!');
    }
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: Number(order.amount * 100),
      currency: order.currency,
      name: 'NextCura',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axiosInstance.post('/user/verify-razorpay', response)
          if (data.success) {
            getUserAppointments();
            navigate('/my-appointments')
            toast.success('Payment successful.')
          }
        } catch (error) {
          console.log(error);
          toast.error('Payment failed!');
        }
      }
    }
    const rzp = new window.Razorpay(options);
    rzp.open()
  }

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axiosInstance.post('/user/payment-razorpay', { appointmentId });
      if (data.success) {
        initPay(data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error('Error while payment!');
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axiosInstance.post('/user/cancel-appointment', { appointmentId });
      if (data.success) {
        getUserAppointments();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while cancelling appointment!");
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
        .then((data) => {
          if (filterOption === "All") {
            setAppointments(data)
          }
          else if (filterOption === "Pending") {
            setAppointments(data.filter(appointments =>
              appointments.cancelled === false && appointments.isCompleted === false
            ))
          }
          else if (filterOption === "Completed") {
            setAppointments(data.filter(appointments => appointments.isCompleted === true))
          }
          else if (filterOption === "Cancelled") {
            setAppointments(data.filter(appointments => appointments.cancelled === true))
          }
        })
        .catch(e => console.log(e))
    }
  }, [token, filterOption])

  return (
    <div>
      <div className='flex justify-between border-b'>
        <p className='pb-3 mt-12 font-medium text-zinc-800'>My appointments</p>
        <div className='flex items-center rounded mx-3'>
          <select className='bg-gray-100 rounded cursor-pointer' onChange={(e) => setFilterOption(e.target.value)} value={filterOption}>
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <div className='mx-1 font-medium'>Filter</div>
        </div>
      </div>
      <div>
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image.url} alt="" />
            </div>
            <div className='flex-1 text-smtext-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-800 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-sm mt-1'><span className='text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 rounded bg-green-500 text-white'>Paid</button>}
              {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => appointmentRazorpay(item._id)} className='text-sm text-stone-800 text-center sm:min-w-48 py-2 border border-primary rounded hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer'>Pay Online</button>}
              {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-800 text-center sm:min-w-48 py-2 border border-red-600 rounded hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer'>Cancel appointment</button>}
              {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 rounded text-red-700'>Appointment Cancelled</button>}
              {item.isCompleted && <button className='sm:min-w-48 py-2 rounded text-green-500'>Appointment Completed</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

export default MyAppointments;