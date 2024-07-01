import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";



const Below = ({ counter }) => {
    const [total, setTotal] = useState(0);
    const [Ctotal, setCtotal] = useState(0);
    const [upcomingDate, setUpcomingDate] = useState(null);
    const selectedHall = Cookies.get("selectedHall");
    const selectedWing = Cookies.get("selectedWing");
    const options = { timeZone: 'Asia/Kolkata' };

    useEffect(() => {
        const calculateTotal = () => {
            let x = counter['1'] * 10 + counter['2'] * 10 + counter['3'] * 10 + counter['4'] * 10 + counter['5'] * 10;
            let y = counter['1'] + counter['2'] + counter['3'] + counter['4'] + counter['5'];
            setTotal(x);
            setCtotal(y);
        };
        calculateTotal();
    }, [counter]);

    useEffect(() => {
        const fetchUpcomingDate = async () => {
          try {
            const response = await fetch('/student/fetchUpcomingDate', {
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
            console.log('Fetched Data:', data); // Log the fetched data
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
    
    const navigate = useNavigate();

    const handleWashCLothes = async () => {
        let clothes = [
            { 'type': 'upper wear', 'quantity': counter['1'] },
            { 'type': 'lower wear', 'quantity': counter['2'] },
            { 'type': 'socks', 'quantity': counter['3'] },
            { 'type': 'heavy wear', 'quantity': counter['4'] },
            { 'type': 'miscellaneous', 'quantity': counter['5'] }
        ];

        console.log("Washing Clothes");

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/student/requestWash`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    "clothes": clothes
                })
            });

            if (response.ok) {
                toast.success("Wash Request made.", {
                    position: "top-center",
                    autoClose: 2000,
                });
                navigate("/StudentDashboard");
            } else if (response.status === 400) {
                const data = await response.json();
                toast.error(data.message, {
                    position: "top-center",
                    autoClose: 2000,
                });
            } else if (response.status === 500) {
                toast.error("Internal Server Error", {
                    position: "top-center",
                    autoClose: 2000,
                });
            } else {
                toast.error("Error making Wash request", {
                    position: "top-center",
                    autoClose: 2000,
                });
            }
        } catch (error) {
            console.error('Error making wash request:', error);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="flex">
                <div className="text-2xl font-bold text-blue-500">
                    Total Clothes:
                </div>
                <div className="flex-auto text-2xl font-bold text-blue-500 text-right">
                    {Ctotal}
                </div>
            </div>

            <div className="flex">
                <div className="text-2xl font-bold text-blue-500">
                    Total Cost:
                </div>
                <div className="flex-auto text-2xl font-bold text-blue-500 text-right">
                    {total}
                </div>
            </div>

            <div className="flex">
                <div className="text-2xl font-bold text-blue-500">
                    Return date:
                </div>
                <div className="flex-auto text-2xl font-bold text-blue-500 text-right">
                {(new Date(upcomingDate)).toLocaleDateString('en-IN', options)}
                </div>
            </div>

            <Button
                variant='contained'
                className="max-w-screen flex flex-col items-center justify-center p- bg-blue-500 text-white px-4 py-2 mt-4 rounded-full focus:outline-none focus:ring focus:border-blue-300"
                onClick={handleWashCLothes}
                disabled={Ctotal === 0}
            >
                WASH
            </Button>
        </>
    );
};

export default Below;
