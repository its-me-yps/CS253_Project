import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import "./calendarApp.css";

const  StudentCalendar= () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [clothes, setClothes] = useState([]);
    const [highlightedDates, setHighlightedDates] = useState([]);
  
    useEffect(() => {
      fetchDatesFromDatabase();
    }, []);
  
    const fetchDatesFromDatabase = async () => {
        // Fetch dates from the database
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/student/fetchDates`, {
            method: 'GET',
            credentials: 'include'
        }
        );
        if (response.ok) {
          const dates = await response.json();
          setHighlightedDates(dates); // Set the dates retrieved from the database
        } else {
          console.error("Failed to fetch dates");
        }
    };
  
    const handleDateClick = (date) => {
      setSelectedDate(date);
      // Fetch events for the selected date
      fetchClothesForDate(date);
    };
  
    const fetchClothesForDate = async (date) => {
        // Fetch events for the selected date
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/student/fetchClothes`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: date,
          })
        });
        
        if (response.ok) {
          const resJson = await response.json();
          setClothes(resJson); // Set the events for the selected date
        } else {
          console.error("Failed to fetch events for the selected date");
        }
    };
  
    const getTileClassName = ({ date }) => {
      const dateString = date.toISOString().split('T')[0];
      // Check if the date is present in the highlightedDates array
      if (highlightedDates.some(date => date.toISOString().split('T')[0] === dateString)) {
        // Color the date based on the boolean value from the database
        return "highlighted";
      }
      return ""; // Default class if date is not present in the highlightedDates array
  };
  return (
    <div className="">
      <div className="">
        <div className="calendar-container">
          <Calendar className="calender"
            value={selectedDate}
            onClickDay={handleDateClick}
            tileClassName={getTileClassName}
          />
        </div>
        {selectedDate && clothes.length > 0 && (
          <div className="event-container">
            <h3>Events on {selectedDate.toDateString()}</h3>
            <ul>
              {clothes.map(event => (
                <li key={event.id}>
                  {event.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCalendar;
