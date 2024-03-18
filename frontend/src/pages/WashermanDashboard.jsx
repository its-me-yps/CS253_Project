import CalendarApp from "../components/dashboardComponents/calendarApp";
import CalendarTop from "../components/dashboardComponents/calendarTop";
import Notification from "../components/dashboardComponents/notification";
import Footer from "../components/dashboardComponents/footerwashdash";

import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";


function WashermanDashboard() {
    const navigate = useNavigate();
    let user = {
        profilepic: "",
        name: "Abhishek Kumar",
        contact: "9142781173"
    };


    // const [cookies, setCookie, removeCookie] = useCookies(['user']);
    // const user = cookies.user;



    function onLogout() {
        // end session from backend
        const response = fetch(`${process.env.REACT_APP_BACKEND_URL}/session/logout`, {
            method: "GET",
            credentials: "include",
        });
        navigate("/");
    }

    return (
        <>
            <div className="flex items-center justify-center flex-column p-10 max-w-xl mx-auto" style={{ backgroundColor: '#8CB9BD' }}>
                <div className="form">
                    <CalendarTop user={user} onLogout={onLogout} hall={"Hall-12"} wing={"C1"} />
                    <CalendarApp />
                    <Notification />
                    <Footer />
                </div>
            </div>
        </>
    );
}

export default WashermanDashboard;
