import "../styles/LandingPage.css";
import { Link } from 'react-router-dom';
import React from 'react';
import '../styles/LandingPage.css';
import logo from '../images/DBMS_LOGO.png';

function LandingPage() {
    return (
        <div className="super-box">
            <div className="form">
                <img src={logo} alt="Logo" className="logo" />
                <div style={{ width: '30%', paddingBottom: '5%', color: 'black' }}>
                    "Say Goodbye to Laundry Hassles: Welcome to DBMS - Your Ultimate Laundry Solution at IITK!"
                </div>
                <div className="lower-part" >
                    <p>Please select your role:</p>
                    <div className="button-container" >
                        <Link to="/login?type=Student">
                            <button className="button-Type1">Student</button>
                        </Link>
                    </div>
                    <div className="button-container" >
                        <Link to="/login?type=Washerman">
                            <button className="button-Type1">Washerman</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
