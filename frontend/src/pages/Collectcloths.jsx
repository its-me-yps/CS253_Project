import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import '../styles/Collectcloths.css';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../styles/Collectcloths.css';
import { useNavigate } from 'react-router-dom';

const Collectcloths = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hall = Cookies.get('selectedHall');
    const wing = Cookies.get('selectedWing');

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
    const navigate = useNavigate();
    const backButton=()=>{
    
       navigate("/WashermanDashboard")
    }
    useEffect(() => {
        fetchRecords();
    }, []);

    const acceptRecord = async (studentIndex, recordIndex, roll) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/washerman/wing/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ hall, wing, roll })
            });

            if (!response.ok) {
                throw new Error('Failed to accept record');
            }

            // Update records state to reflect the change in acceptance
            const updatedRecords = [...records];
            updatedRecords[studentIndex].records[recordIndex].accept = true;
            setRecords(updatedRecords);
            window.alert('Cloths are being accepted');
            // Refetch records to get the updated data
            fetchRecords();
        } catch (error) {
            console.error('Error accepting record:', error);
            // Handle error if necessary
        }
    };

    if (loading) {
        return <div className="cloth-collection loading">Loading...</div>;
    }

    if (error) {
        return <div className="cloth-collection error">Error: {error}</div>;
    }

    return (
        <div className="cloth-collection">
          <div className="p-4">
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={backButton}>Back</Button>
      </div>
            <h2><strong>Records</strong></h2>
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
                    {records.map((student, studentIndex) => (
                        <tr key={studentIndex}>
                            <td>{student.name}</td>
                            <td>{student.roll}</td>
                            <td>{student.wing}</td>
                            <td>{student.hall}</td>
                            <td>
                                <ul>
                                    {student.records.map((record, recordIndex) => (
                                        <li key={recordIndex}>
                                            Date: {(new Date(record.date)).toDateString()}<br />
                                            Clothes: {record.clothes.map((cloth, clothIndex) => (
                                                <span key={clothIndex}>{cloth.type} ({cloth.quantity}){clothIndex !== record.clothes.length - 1 ? ', ' : ''}</span>
                                            ))}
                                            <br />
                                            Accepted: {record.accept.toString()}<br />
                                            {!record.accept && (
                                                <Button variant='contained' onClick={() => acceptRecord(studentIndex,recordIndex,student.roll)}>Accept</Button>
                                            )}
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
