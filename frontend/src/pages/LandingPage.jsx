import "../styles/LandingPage.css";
import { Link } from 'react-router-dom';


function LandingPage() {
    return (
        <div className="flex items-center justify-center h-screen p-10 max-w-xl mx-auto" style={{ backgroundColor: '#8CB9BD' }}>
            <div  className="form pt-0">
                <img src={'DBMS_LOGO.png'} alt="Logo" className="logo" />
                <div className="text-center p-2 italic">
                    "Say Goodbye to Laundry Hassles: Welcome to DBMS - Your Ultimate Laundry Solution at IITK!"
                </div>
                <div className="lower-part p-2 font-bold" >
                    <p>Please select your role:</p>
                    <div className="button-container p-1" >
                        <Link to="/login?type=student">
                            <button className="button-Type1">Student</button>
                        </Link>
                    </div>
                    <div className="button-container" >
                        <Link to="/login?type=washerman">
                            <button className="button-Type1">Washerman</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
