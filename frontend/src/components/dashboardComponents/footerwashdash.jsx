import Button from '@mui/material/Button'; 
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Footer = () => {
    const navigate = useNavigate(); // Initialize navigate function

    const handlePrintSummary = () => {
        navigate("/Washerman/PrintSummary"); // Navigate to SummaryPage
    };

    const handleCollectClothes = () => {
        navigate("/Washerman/Collect")// Handle collect clothes action
    };

    return (
        <div className='flex p-4'>
            <Button variant='contained' className='print-button' onClick={handlePrintSummary}>
                Print Summary
            </Button>
            <Button variant='contained' className='cloths-button' onClick={handleCollectClothes}>
                Collect Clothes
            </Button>
        </div>
    );
}

export default Footer;
