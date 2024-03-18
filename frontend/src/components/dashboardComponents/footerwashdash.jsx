import Button from '@mui/material/Button'; 
import React, { useEffect } from 'react';
import './footerwashdash.css';

const Footer =()=>{


    return(
      <div className='flex p-4 '>
            <Button variant='contained'
            className='print-button' >
            Print Summary
            </Button>
            <Button variant='contained'
            className='cloths-button' >
            Collect Cloths
            </Button>
            
        </div>
    )


}
export default Footer;