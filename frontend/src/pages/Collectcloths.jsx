import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import '../styles/Collectcloths.css';
import { useNavigate } from 'react-router-dom';
const Collectcloths = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hall = Cookies.get('selectedHall');
    const wing = Cookies.get('selectedWing');

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/washerman/wing/collectCloths`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify({ hall, wing })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch records');
                }

                const data = await response.json();
                setRecords(data.records);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);
    const navigate = useNavigate();
    const backButton=()=>{
    
       navigate("/WashermanDashboard")
    }
    if (loading) {
        return <div className="cloth-collection loading">Loading...</div>;
    }

    if (error) {
        return <div className="cloth-collection error">Error: {error}</div>;
    }

    return (
        <div className="cloth-collection">
            <Button variant="contained" onClick={backButton} className="bg-blue-500 text-white px-4 py-2 mt-4 text-lg  rounded-full justify-start font-extrabold" >
        Back
      </Button>
            <h1><strong>Records</strong></h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Roll</th>
                        <th>Wing</th>
                        <th>Hall</th>
                        <th>Records</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((student, index) => (
                        <tr key={index}>
                            <td>{student.name}</td>
                            <td>{student.roll}</td>
                            <td>{student.wing}</td>
                            <td>{student.hall}</td>
                            <td>
                                <ul>
                                    {student.records.map((record, index) => (
                                        <li key={index}>
                                            Date: {record.date}<br />
                                            Clothes: {record.clothes.map((cloth, index) => (
                                                <span key={index}>{cloth.type} ({cloth.quantity}){index !== record.clothes.length - 1 ? ', ' : ''}</span>
                                            ))}
                                            <br />
                                            Accepted: {record.accept.toString()}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Collectcloths;
