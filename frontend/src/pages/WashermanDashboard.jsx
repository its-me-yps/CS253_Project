import CalendarApp from "../components/dashboardComponents/calendarApp";
import CalendarTop from "../components/dashboardComponents/calendarTop";
import Notification from "../components/dashboardComponents/notification";
import Footer from "../components/dashboardComponents/footerwashdash";
import { useNavigate } from "react-router-dom";

function WashermanDashboard() {
    const navigate = useNavigate();
    let user = {
        profilepic: "/Users/abhishek/Desktop/React/Washerman Dashboard/src/karl-magnuson-85J99sGggnw-unsplash.jpeg",
        name: "Abhishek Kumar",
        contact: "9142781173"
    };

    function onLogout() {
        // end session from backend
        console.log("Logout buttons pressed");
        navigate("/")
    }

    return (
        <>
            <div className="flex items-center justify-center flex-column p-10 max-w-xl mx-auto" style={{ backgroundColor: '#8CB9BD' }}>
            <div className="form">
            <CalendarTop user={user} onLogout={onLogout} hall={"Hall-12"} wing={"C1"} />
            <CalendarApp />
            <Notification />
            <Footer/>
            </div>
            </div>
        </>
    );
}

export default WashermanDashboard;
