import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import "./calendarApp.css";
import './footerwashdash.css';
const StudentCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [clothes, setClothes] = useState([]);
    const [highlightedDates, setHighlightedDates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDatesFromDatabase();
    }, []);

    const fetchDatesFromDatabase = async () => {
        // Fetch dates from the database
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/student/fetchDates`, {
            method: 'GET',
            credentials: 'include'
        });
        if (response.ok) {
            const resJson = await response.json();
            setHighlightedDates(resJson.dates); // Set the dates retrieved from the database
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
        return ""; // Default class if date is not present in the highlightedDates array
    };

    const handleWashClothes = () => {
        const today = new Date();
        // Check if the selected date is today's date
        if (selectedDate && selectedDate.toDateString() === today.toDateString()) {
            console.log("Wash Clothes clicked");
            navigate("/WashClothes");
        } else {
            console.log("Selected date is not today");
            // Handle case where selected date is not today
        }
    }

    const handlePayDues = () => {
        navigate("/PayDues");
    }

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
            <div className='flex pt-3'>
                <Button variant='contained' className='print-button' onClick={handlePayDues}>
                    Pay dues
                </Button>
                <Button variant='contained' className='cloths-button' onClick={handleWashClothes}>
                    Wash Clothes
                </Button>
            </div>
        </div>
    );
};

export default StudentCalendar;

