import React from "react";
import { useCookies } from "react-cookie";

import CalendarTop2 from "../components/dashboardComponents/calendarTop2";
import StudentCalendar from "../components/dashboardComponents/studentcalender";
import Footerstudent from "../components/dashboardComponents/footerstudentdash";

import { useNavigate } from 'react-router-dom';

function StudentDashboard(){

    // const [cookies, setCookie, removeCookie] = useCookies(['user']);
    // const user = cookies.user;

   const navigate = useNavigate();

   const user = {
       profilepic: "",
       name: "Abhishek Kumar",
       email: "abc",
       
    };

    function onLogout() {
        // end session from backend
        const response = fetch(`${process.env.REACT_APP_BACKEND_URL}/session/logout`, {
            method: "GET",
            credentials: "include",
        });
        navigate("/");
    }

    return(
        <>
        <div className="flex items-center justify-center flex-column p-10 max-w-xl mx-auto" style={{ backgroundColor: '#8CB9BD' }}>
            <div className="form">
       <CalendarTop2 user={user} onLogout={onLogout}/>
       <StudentCalendar/>
       <Footerstudent/>
       </div>
       </div>
       </>

    );
}

export default StudentDashboard;