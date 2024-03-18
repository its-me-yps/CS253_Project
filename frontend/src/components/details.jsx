import Button from '@mui/material/Button'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./details.css"
import { useNavigate } from "react-router-dom";

const Details = ({ user, onLogout }) => {
  const handleGoBack = () => {
    console.log("Go back clicked");
  };

  return (
    <div className='top'>
      <div className="back-button-container">
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleGoBack}>Back</Button>
      </div>
      <div className="user-profile-container">
        <div className="profile-pic">
          <img src="/karl-magnuson-85J99sGggnw-unsplash.jpeg" alt="User Profile" />
        </div>
        <div className="user-details">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Mobile No:</strong> {user.mobile}</p>
          <Button variant="contained" onClick={onLogout}>Logout</Button>
        </div>
      </div>
    </div >
  );
};

export default Details;
