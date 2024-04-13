import React, { useState, useEffect } from 'react';
import  '../styles/SummaryPage.css';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
const SummaryPage = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hall = Cookies.get('selectedHall');
  const wing = Cookies.get('selectedWing');

const navigate = useNavigate();
const backButton=()=>{

   navigate("/WashermanDashboard")
}
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/washerman/wing/fetchSummary`,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ hall, wing }),
        
    });
        if (!response.ok) {
          throw new Error('Failed to fetch summary data');
        }
        const data = await response.json();
        setSummaryData(data.summary);
        setLoading(false);
      } catch (error) {
        setError('Error fetching summary data');
        setLoading(false);
      }
    };

    fetchSummaryData();
  },[]);
if(loading)
{
  return <div className="cloth-collection loading">Loading...</div>;
}
if(error)
{
    return <div>Error: {error}</div>
}
return (
  
      
    <div>
      <Button variant="contained" startIcon={<ArrowBackIcon />}onClick={backButton}  >
        Back
      </Button>
      <h1><strong>Summary Page</strong></h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : summaryData.length === 0 ? (
        <p>No summary data available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Wing</th>
              <th>Hall</th>
              <th>Total Clothes</th>
              <th>Total Dues</th>
              <th>Month</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((data, index) => (
              <tr key={index}>
                <td>{data.Name}</td>
                <td>{data.Wing}</td>
                <td>{data.Hall}</td>
                <td>{data['Total Clothes']}</td>
                <td>{data['Total Dues']}</td>
                <td>{data.Month}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    
  );
};

export default SummaryPage;
