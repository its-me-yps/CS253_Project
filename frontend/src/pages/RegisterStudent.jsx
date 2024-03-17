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

    // below lines are for storing otp from 6 input boxes and adding it to formData.otp
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

    // Handling the form submission
    const handleRegister = () => {

        const Register = async () => {

            const response = await fetch('http://localhost:8080/register', {
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
            console.log(formData.otp);
            alert('Registration successful');
            navigator('/Login?type=Student');
        }
        else {
            alert('Registration failed. Please try again and make sure you are not already registered.');
        }
    };


    const sendOtpRequest = () => {
        const sendOtp = async () => {
            const response = await fetch('http://localhost:8080/sendOtp', {
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
        <div className="input-container">
            <div className="super-box">
                <div className="form">
                    <h1>Register</h1>
                    
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
                        <label>Roll no: </label>
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

                    <div className="dropdown-container">
                        <select
                            className="dropdown"
                            name="hall"
                            value={formData.hall}
                            onChange={handleChange_student}
                        >
                            <option value="" disabled>
                                Select Hall
                            </option>
                            <option value="hall-1">Hall 1</option>
                            <option value="hall-2">Hall 2</option>
                            <option value="hall-3">Hall 3</option>
                            <option value="hall-4">Hall 4</option>
                            <option value="hall-5">Hall 5</option>
                            <option value="hall-6">Hall 6</option>
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
                            <option value="wing-f">Wing f</option>
                        </select>
                    </div>
                    {!otpSent &&
                        <div className="button-container">
                            <button className="button-Type1" onClick={sendOtpRequest}>
                                Get OTP
                            </button>
                        </div>
                    }
                    {otpSent && (
                        <div>
                            <div className="otp-input-container">
                                <label>Enter OTP: </label>
                                {otp.map((digit, index) => (
                                    <input id='au-input'
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
                                {/* <button className='button-Type1'>Verify OTP</button> */}
                                {/* <button className='button-Type1'onClick={sendOtpRequest}>Resend OTP</button> */}
                                <button className="button-Type1" onClick={handleRegister}>
                                    Register
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="form-footer">
                        <p>Already have an account? <Link to="/login?type=Student">Login Here
                        </Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default RegisterStudent;