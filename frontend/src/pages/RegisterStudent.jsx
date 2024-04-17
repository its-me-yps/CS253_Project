import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/RegisterStudent.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const handleRegister = async () => {

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

        const gotRegistered = await Register();
        if (gotRegistered) {
            toast.success('Registration successful', {
                position: "top-center",
                autoClose: 2000,
            });
            navigator('/Login?type=student');
        }
        else {
            toast.error('Registration failed. Please try again and make sure you are not already registered.', {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const sendOtpRequest = async () => {
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
            toast.error('Please enter all the fields', {
                position: "top-center",
                autoClose: 2000,
            });
        }
        else if (formData.password.length < 6) {
            toast.error('Password should be at least 6 characters long', {
                position: "top-center",
                autoClose: 2000,
            });
        }
        else if (formData.password !== formData.confirmPassword) {
            toast.error('Confirm your password correctly', {
                position: "top-center",
                autoClose: 2000,
            });
        }
        else {
            const otpSent = await sendOtp();
            if (otpSent) {
                setOtpSent(true);
            }
            else {
                toast.error('Failed to send OTP. Please try again.', {
                    position: "top-center",
                    autoClose: 2000,
                });
            }
        }
    }

    return (
        <div className="flex items-center justify-center h-screen p-10 max-w-xl mx-auto" style={{ backgroundImage: 'linear-gradient(to bottom, #b1dfdfef, hsl(0, 35%, 85%))' }} >
            <ToastContainer />
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
                {/* Other input fields */}
                {/* ... */}
                {!otpSent &&
                    <div className="button-container" id="OTP_Container">
                        <button className="button-Type1" onClick={sendOtpRequest}>
                            Get OTP
                        </button>
                    </div>
                }
                {otpSent && (
                    <div className="">
                        {/* OTP input fields */}
                        {/* ... */}
                        <div className="button-container">
                            <div className="p-1">
                                <button className='button-Type1 registerbutton' onClick={sendOtpRequest}>Resend OTP</button>
                            </div>
                            <div className='p-1'>
                                <button className="button-Type1  registerbutton" onClick={handleRegister}>
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