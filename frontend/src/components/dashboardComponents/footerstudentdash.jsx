import Button from '@mui/material/Button'; 
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './footerwashdash.css';


const Footerstudent =()=>{

    const navigate = useNavigate();

    const handleWashClothes = () => {
        console.log("Wash Clothes clicked");
        navigate("/WashClothes");
    }

    const handlePayDues = () => {
        navigate("/PayDues");
    }

    return(
      <div className='flex pt-3'>
            <Button variant='contained' className='print-button' onClick={handlePayDues} >
                    Pay dues
            </Button>
            <Button variant='contained' className='cloths-button' onClick={handleWashClothes}>
                    Wash Cloths
            </Button>
        </div>
    )

}

export default Footerstudent;