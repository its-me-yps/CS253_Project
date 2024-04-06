import React from 'react';
import Button from '@mui/material/Button'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

import "./calendarTop.css";

const CalendarTop = ({ user, onLogout, hall, wing }) => {
  const navigate = useNavigate(); // Move inside the component

  const handleGoBack = () => {
    navigate("/WashermanSelection");
  };

  return (
    <div className='top'>
      <div className="p-4">
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleGoBack}>Back</Button>
      </div>
      <div className="user-profile-container">
        <div className="profile-pic">
          <img src="karl-magnuson-85J99sGggnw-unsplash.jpg" alt="User Profile" />
        </div>
        <div className="pl-2">
          <p><strong>Name:</strong> {user.name}</p>
          {user.email && <p><strong>email :</strong> {user.email}</p>}
          {user.contact && <p><strong>mobile no :</strong> {user.contact}</p>}
          <p><strong>Hall:</strong> {hall}</p>
          <p><strong>Wing:</strong> {wing}</p>
          <Button variant="contained" onClick={onLogout}>Logout</Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarTop;
