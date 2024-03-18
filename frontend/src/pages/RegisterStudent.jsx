import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/RegisterStudent.css';
import { useNavigate } from 'react-router-dom';


function RegisterStudent() {
    // States for registration
    const [formData, setFormData] = useState({
        name: '',
        roll: '',
        email: '',
        password: '',
        confirmPassword: '',
        hall: '',
        wing: '',
        otp: '',
    });

    const [otpSent, setOtpSent] = useState(false);

    const navigator = useNavigate();

    // Handling the input changes
    const handleChange_student = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const handleOtpChange = (e, index) => {
        const newOtp = [...otp];
        newOtp[index] = e.target.value;
        setOtp(newOtp);
        formData.otp = newOtp.join('');
        if (e.target.value !== '') {
            if (index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1].focus();
            }
    }
    };
    // Handling the form submission
    const handleRegister = () => {

        const Register = async () => {

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/student/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    roll: formData.roll,
                    email: formData.email,
                    pass: formData.password,
                    hall: formData.hall,
                    wing: formData.wing,
                    authCode: formData.otp,
                }),
            });
            if (!response.ok) {
                return false;
            }
            return true;
        };

        const gotRegistered = Register();
        if (gotRegistered) {
            alert('Registration successful');
            navigator('/Login?type=Student');
        }
        else {
            alert('Registration failed. Please try again and make sure you are not already registered.');
        }
    };

    const sendOtpRequest = () => {
        const sendOtp = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sendAuthCode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    roll: formData.roll,
                }),
            });
            if (!response.ok) {
                return false;
            }
            return true;
        }

        if (
            formData.name === '' ||
            formData.roll === '' ||
            formData.email === '' ||
            formData.password === '' ||
            formData.confirmPassword === '' ||
            formData.hall === '' ||
            formData.wing === ''
        ) {
            alert('Please enter all the fields');
        }
        else if (formData.password.length < 6) {
            alert('Password should be atleast 6 characters long');
        }
        else if (formData.password !== formData.confirmPassword) {
            alert('Confirm your password correctly');
        } 
        else {
            const otpSent = sendOtp();
            if (otpSent) {
                setOtpSent(true);
            }
            else {
                alert('Failed to send OTP. Please try again.');
            }
        }
    }

    return (
        <div className="flex items-center justify-center h-screen p-10 max-w-xl mx-auto" style={{ backgroundColor: '#8CB9BD' }} >
            <div className="form pt-8 pb-8 ">
                <h1>Register</h1>
                <br />
                <div className="input-container">
                    <label>Name: </label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange_student}
                    />
                </div>
                <div className="input-container">
                    <label>Roll: </label>
                    <input
                        type="text"
                        placeholder="Enter your Roll no"
                        name="roll"
                        value={formData.roll}
                        onChange={handleChange_student}
                    />
                </div>
                <div className="input-container">
                    <label>Email id: </label>
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange_student}
                    />
                </div>
                <div className="input-container">
                    <label>Password: </label>
                    <input
                        type="password"
                        placeholder="Create Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange_student}
                    />
                </div>
                <div className="input-container">
                    <label>Confirm Password: </label>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange_student}
                    />
                </div>

                <div className="dropdown-container ">
                    <select
                        className="dropdown"
                        name="hall"
                        value={formData.hall}
                        onChange={handleChange_student}
                    >
                        <option value="" disabled className="font-thin">
                            Select Hall
                        </option>
                        <option value="hall-1">Hall 1</option>
                        <option value="hall-2">Hall 2</option>
                        <option value="hall-3">Hall 3</option>
                        <option value="hall-4">Hall 4</option>
                        <option value="hall-5">Hall 5</option>
                    </select>
                </div>

                <div className="dropdown-container">
                    <select
                        className="dropdown"
                        name="wing"
                        value={formData.wing}
                        onChange={handleChange_student}
                    >
                        <option value="" disabled>
                            Select Wing
                        </option>
                        <option value="wing-a">Wing a</option>
                        <option value="wing-b">Wing b</option>
                        <option value="wing-c">Wing c</option>
                        <option value="wing-d">Wing d</option>
                        <option value="wing-e">Wing e</option>
                    </select>
                </div>
                {!otpSent &&
                    <div className="button-container" id = "OTP_Container">
                        <button className="button-Type1" onClick={sendOtpRequest}>
                            Get OTP
                        </button>
                    </div>
                }
                {otpSent && (
                    <div className="" >
                         <label className="text-center">Enter OTP: </label>
                            <div className=" flex items-center justify-center" >
                                
                                {otp.map((digit, index) => (
                                    <input className="p-6 m-4 flex items-center justify-center text-center"
                                    style={{width:'30px'}}
                                        key={index}
                                        type="text"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e, index)}
                                        maxLength={1}
                                        ref={(ref) => (inputRefs.current[index] = ref)}
                                    />
                                ))}
                            </div>
                        <div className="button-container">
                            <div className="p-1">
                        <button className='button-Type1'onClick={sendOtpRequest}>Resend OTP</button>
                        </div>
                        <div className='p-1'>
                            <button className="button-Type1" onClick={handleRegister}>
                                Register
                            </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="form-footer">
                    <p>Already have an account? <Link className="text-blue-800" to="/login?type=student">Login Here
                    </Link></p>
                </div>
            </div>
        </div>
    );
}
export default RegisterStudent;