import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Admin/Dashboard.jsx';
import AllAppointments from './pages/Admin/AllAppointments.jsx';
import AddDoctor from './pages/Admin/AddDoctor.jsx';
import DoctorsList from './pages/Admin/DoctorsList.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx';
import DoctorAppointments from './pages/Doctor/DoctorAppointments.jsx';
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx';

const App = () => {
  const location = useLocation();
  const [isLogged, setIsLogged] = useState(localStorage.getItem('logged') === 'true');

  useEffect(() => {
    const updateLoginState = () => {
      setIsLogged(localStorage.getItem('logged') === 'true');
    };

    window.addEventListener('storage', updateLoginState);
    return () => window.removeEventListener('storage', updateLoginState);
  }, []);

  useEffect(() => {
    setIsLogged(localStorage.getItem('logged') === 'true');
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/admin/login' || location.pathname === '/doctor/login') {
      localStorage.removeItem('logged');
      setIsLogged(false);
    }
  }, [location.pathname]);

  return (
    <div>
      <Navbar />
      <div className={isLogged ? 'flex items-start' : ''}>
        <Sidebar />
        <Routes>
          <Route path='/admin/login' element={<Login />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/all-appointments' element={<AllAppointments />} />
          <Route path='/admin/add-doctor' element={<AddDoctor />} />
          <Route path='/admin/doctors-list' element={<DoctorsList />} />

          <Route path='/doctor/login' element={<Login />} />
          <Route path='/doctor/dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor/appointments' element={<DoctorAppointments />} />
          <Route path='/doctor/profile' element={<DoctorProfile />} />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  )
};

export default App;