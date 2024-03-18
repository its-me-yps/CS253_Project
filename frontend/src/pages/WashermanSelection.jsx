import '../styles/WashermanSelection.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function WashermanSelection() {

    // State for hall number and wing number
    const [selectedHall, setSelectedHall] = useState('');
    const [selectedWing, setSelectedWing] = useState('');
    const [hallsData, setHallsData] = useState([]);
    const [cookies] = useCookies(['info']);

    const navigate = useNavigate();

    useEffect(() => {
        // Extracting halls data from the cookie
        const info = cookies['info'];
        if (info && info.halls) {
            setHallsData(info.halls);
        }
    }, [cookies]);

    // Function to handle changes in hall number dropdown
    const handleHallChange = (event) => {
        setSelectedHall(event.target.value);
    };

    // Function to handle changes in wing number dropdown
    const handleWingChange = (event) => {
        setSelectedWing(event.target.value);
    };

    // Function to confirm the selection
    const handleConfirm = () => {
        if (selectedHall === '' || selectedWing === '') {
            alert('Please select hall and wing');
        } else {
            navigate('/WashermanDashboard', { state: { hall: selectedHall, wing: selectedWing } });
        }
    };
    
    return (
        <div className='super-box'>
            <div className='form'>
                <h1> Washerman</h1>
                <br />
                <h4>Select Hall:</h4>
                <div className='dropdown-container'>
                    <select id="hallDropdown" className='dropdown' value={selectedHall} onChange={handleHallChange}>
                        <option value="" disabled>-Select-</option>
                        {hallsData.map((hall, index) => (
                            <option key={index} value={hall.name}>{hall.name}</option>
                        ))}
                    </select>
                </div>
                {selectedHall && 
                    <div>
                        <h4>Select Wing:</h4>
                        <div className='dropdown-container'>
                            <select id="wingDropdown" className='dropdown' value={selectedWing} onChange={handleWingChange}>
                                <option value="" disabled>-Select-</option>
                                {hallsData.find(hall => hall.name === selectedHall)?.wings.map((wing, index) => (
                                    <option key={index} value={wing.name}>{wing.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                }
                <div className='button-container'>
                    <Link to="/">
                        <button className='button-Type1' onClick={handleConfirm}>
                            Confirm
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default WashermanSelection;
