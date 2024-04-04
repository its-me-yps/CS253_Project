import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import Button from '@mui/material/Button'; 
import DeleteIcon from '@mui/icons-material/Delete';

import "./calendarApp.css";

const CalendarApp = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventName, setEventName] = useState("visiting");
  const [events, setEvents] = useState([]);

  const Date_Click_Fun = (date) => {
    setSelectedDate(date);
    if(!eventName){
      setEventName("visiting");
    }
  };

  const Create_Event_Fun = () => {
    if (selectedDate && eventName) {
      const newEvent = {
        id: new Date().getTime(),
        date: selectedDate,
        title: eventName,
      };
      setEvents([...events, newEvent]);
    }
  };

  

      const updateUpcomingDate = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/washerman/upcomingDate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ upcomingDate: selectedDate }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message); // Success message
      } else {
        console.error(data.message); // Error message
      }
    } catch (error) {
      console.error('Error updating upcoming date:', error);
    }
  };
  

  const Delete_Event_Fun = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
  };

  return (
    <div className="">
      <div className="container">
        <div className="calendar-container">
          <Calendar className="calender"
            value={selectedDate}
            onClickDay={Date_Click_Fun}
            tileClassName={({ date }) =>
              selectedDate &&
              date.toDateString() === selectedDate.toDateString()
                ? "selected"
                : events.some(
                    (event) =>
                      event.date.toDateString() === date.toDateString()
                  )
                ? "event-marked"
                : ""
            }
          />
        </div>
        <div className="event-container">
          <div className="event-form">
            <h3>Add Upcoming Date</h3>
            <p>
              Selected Date:
              {selectedDate ? selectedDate.toDateString() : <b>Select a date </b>}
            </p>
           
            <Button variant="contained" className="create-btn" onClick={updateUpcomingDate} id="11">
              Notify Upcoming Date
            </Button>
          </div>
          <div className="event-form">
            <h3>Create Event</h3>
            <p>
              Selected Date:
              {selectedDate ? selectedDate.toDateString() : <b>Select a date </b>}
            </p>
            <input
              type="text"
              placeholder="Event Name"
              value={eventName}
              className="pb-2"
              id="input" // Adding id here
              onChange={(e) => setEventName(e.target.value)}
            />
            <Button variant="contained" className="create-btn" onClick={Create_Event_Fun} id="11">
              Add Event
            </Button>
          </div>
          <div className="event-list">
            <h3>Events</h3>
            <ul>
              {events.map((event) => (
                <li key={event.id}>
                  <span>
                    {event.date.toDateString()} - {event.title}
                  </span>
                  <Button variant="outlined" style={{color:"red", border:"1px solid red"}} startIcon={<DeleteIcon/>} onClick={() => Delete_Event_Fun(event.id)} id="11">
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;
