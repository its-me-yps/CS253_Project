import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import "./calendarApp.css";
import './footerwashdash.css';

const StudentCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [highlightedDates, setHighlightedDates] = useState([]);
    const [clothesMap, setClothesMap] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [clothesForDate, setClothesForDate] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch all dates
            const datesResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/student/fetchDates`, {
                method: 'GET',
                credentials: 'include'
            });
            if (datesResponse.ok) {
                const datesJson = await datesResponse.json();
                setHighlightedDates(datesJson.dates);

                // Fetch clothes records for each date
                const clothesData = await Promise.all(datesJson.dates.map(async date => {
                    const clothesResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/student/fetchRecord`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            date: date,
                        })
                    });
                    if (clothesResponse.ok) {
                        const clothesJson = await clothesResponse.json();
                        return { date: date, clothes: clothesJson.clothes };
                    } else {
                        console.error("Failed to fetch clothes for date", date);
                        return { date: date, clothes: [] };
                    }
                }));

                // Construct a map with date as key and clothes as value
                const clothesMap = {};
                clothesData.forEach(({ date, clothes }) => {
                    clothesMap[date] = clothes;
                });
                setClothesMap(clothesMap);
                console.log(clothesMap);
            } else {
                console.error("Failed to fetch dates");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setClothesForDate(clothesMap[date.toDateString()] || []);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleWashClothes = () => {
        navigate("/WashClothes");
    }


    return (
        <div className="">
            <div className="">
                <div className="calendar-container">
                <Calendar
                    className="calender"
                    value={selectedDate}
                    onClickDay={handleDateClick}
                    tileClassName={({ date, view }) => {
                        const dateString = date.toDateString();
                        if(!highlightedDates.includes(dateString)) {
                            return "";
                        }
                        if (clothesMap[dateString] && clothesMap[dateString][0] && clothesMap[dateString][0].accept) {
                            return "green-tile";
                        } else {
                            return "red-tile";
                        }
                    }}
                />
                </div>
            </div>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Clothes for {selectedDate && selectedDate.toDateString()}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {clothesForDate.length > 0 ? (
                            <ul>
                                {clothesForDate[0].clothes.map((cloth, index) => (
                                    <li key={index}>
                                        <b>Type</b>: {cloth.type}, <b>Quantity</b>: {cloth.quantity}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No clothes recorded for this date</p>
                        )}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <div className='flex pt-3'>
            <a href="https://rzp.io/l/SIdstorK">
                <Button variant='contained' className='print-button' >
                   Pay dues
                </Button></a>
                <Button variant='contained' className='cloths-button' onClick={handleWashClothes}>
                    Wash Clothes
                </Button>
            </div>
        </div>
    );
};

export default StudentCalendar;
