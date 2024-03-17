    import React, { useState } from "react";
    import "../styles/Login.css";
    import { Link, useLocation, useNavigate } from "react-router-dom";
    import { FaArrowLeft } from 'react-icons/fa';
    import { useCookies } from 'react-cookie';


    function Login() {

        
        const location = useLocation();
        const searchParams = new URLSearchParams(location.search);
        const userType = searchParams.get("type");

        const navigator = useNavigate();

        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");
        const [cookies, setCookie] = useCookies(['info']);

        //api calling function
        const verifyUser = async () => {
            const response = await fetch(`http://localhost:5000/${userType}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
    
            const resJson = await response.json();
    
            if (response.ok) {
                const info = resJson.info;
                setCookie('info', info, { path: '/' }); // Set the 'info' cookie
                return true;
            }
            return false;
        }
        
        const handleUsernameChange = (event) => {
            setUsername(event.target.value);
        }

        const handlePasswordChange = (event) => {
            setPassword(event.target.value);
        }

        const handleLogin = () => {
            if (username === "" || password === "")
                alert("Please enter all the fields");
            else{
                const isValidUser = verifyUser();
                if (isValidUser) {
                    if(userType === "Student"){
                        navigator('/StudentDashboard');
                    }
                    else{
                        navigator('/WashermanDashboard');
                    }
                }
                else{
                    alert("Invalid Credentials");
                }
            }
        }

        return (
            <div className="super-box">
                <div className="form">
                    <div className='ArrowContainer_washer' ><Link to="/"><FaArrowLeft className='arrow_washer' /></Link></div>
                    <h1>Login</h1>
                    <div className="input-container">
                        <label>Username:</label>
                        <input type="text" placeholder="Roll no/mobile no" onChange={handleUsernameChange} />
                    </div>
                    <div className="input-container">
                        <label>Password:</label>
                        <input type="password" placeholder="password" onChange={handlePasswordChange} />
                    </div>
                    <div className="button-container">
                            <button className="button-Type1" onClick={handleLogin}>Login</button>
                    </div>
                    {userType === "Student" &&
                        <div className="form-footer">
                            <p>Forgot Password?
                                <Link to="/resetPassword"> Create New Password</Link>
                            </p>
                            <p>Don't have an account?
                                <Link to="/RegisterStudent"> Register Here</Link>
                            </p>
                        </div>
                    }
                </div>
            </div>
        )
    }
    export default Login;