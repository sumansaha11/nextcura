import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance.js';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';

const Login = () => {
  const navigate = useNavigate();

  const { token, setToken } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (state === 'Sign Up') {
        const { data } = await axiosInstance.post('/user/register', { name, email, password });
        if (data.success) {
          toast.success("Account created.")
        }
      } else {
        const { data } = await axiosInstance.post('/user/login', { email, password });
        if (data.success) {
          toast.success("Logged in.")
        }
      }
      localStorage.setItem('token', true);
      setToken(true);
      navigate('/');
    } catch (error) {
      toast.error("Error while login!");
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 bg-white text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
        <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to book appointment</p>
        {
          state === 'Sign Up' &&
          <div className='w-full'>
            <p>Full Name</p>
            <input className='border border-zinc-500 rounded w-full p-2 mt-1' type="text" onChange={(e) => setName(e.target.value)} value={name} />
          </div>
        }

        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-500 rounded w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-500 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
        </div>
        <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base cursor-pointer'>{state === 'Sign Up' ? "Create Account" : "Login"}</button>
        {
          state === 'Sign Up'
            ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login</span></p>
            : <p>Create a new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>click here</span></p>
        }
      </div>
    </form>
  )
};

export default Login;