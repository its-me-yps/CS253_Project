import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import "./calendarTop.css";
import Cookies from "js-cookie";
const CalendarTop2 = ({ user, onLogout }) => {
  const [upcomingDate, setUpcomingDate] = useState(null); // State to store the upcoming date

  const selectedHall = Cookies.get("selectedHall");
  const selectedWing = Cookies.get("selectedWing");
  const options = { timeZone: 'Asia/Kolkata' };
  useEffect(() => {
    const fetchUpcomingDate = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/student/fetchUpcomingDate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            hall: selectedHall,
            wing: selectedWing,
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch upcoming date');
        }
        const data = await response.json();
        if (data.success) {
          setUpcomingDate(data.upcomingDate);
        } else {
          console.error('Error fetching upcoming date:', data.message);
        }
      } catch (error) {
        console.error('Error fetching upcoming date:', error);
      }
    };
  
    fetchUpcomingDate();
  }, []);
  

  return (
    <div className='top'>
      {/* Display upcoming date if available */}
      {upcomingDate && (
        <div className="upcoming-date">
            <h3 style={{ color: 'red' }}><strong>Upcoming date of your allotted washerman is - {(new Date(upcomingDate)).toLocaleDateString('en-IN', options)}</strong></h3>
        </div>
      )}

      <div className="flex flex-row">
        <div className="user-profile-container">
          <div className="profile-pic">
            <img src={`https://oa.cc.iitk.ac.in/Oa/Jsp/Photo/${user?.roll}_0.jpg`} alt="User Profile" />
          </div>
          <div className="pl-2">
            <p><strong>Name:</strong> {user?.name} </p>
            {user?.email && <p><strong>email :</strong> {user?.email}</p>}
            {user?.contact && <p><strong>mobile no :</strong> {user?.contact}</p>}
            <p><strong>hall:</strong> {user?.hall}</p>
            <p><strong>wing:</strong> {user?.wing}</p>
            <Button variant="contained" onClick={onLogout}>Logout</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarTop2;
