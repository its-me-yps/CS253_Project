import Button from '@mui/material/Button'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./calendarTop.css";

const CalendarTop = ({ user, onLogout,hall,wing }) => {
const handleGoBack = () => {
    console.log("Go back clicked");
};

  return (
    <div className='top'>
      <div className="p-4">
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleGoBack}>Back</Button>
       
      </div>
      <div className="flex flex-row">
        <div className="border rounded-full ">
          <img src="/karl-magnuson-85J99sGggnw-unsplash.jpeg" alt="User Profile" />
        </div>
        <div className="pl-2">
          <p><strong>Name:</strong> {user.name}</p>
          {user.email && <p><strong>email :</strong> {user.email}</p>}
          {user.contact && <p><strong>mobile no :</strong> {user.contact}</p>}
          <p><strong>hall:</strong> {user.hall}</p>
          <p><strong>wing:</strong> {user.wing}</p>
          <Button variant="contained" onClick={onLogout}>Logout</Button>
        </div>
      </div>
    </div >
  );
};

export default CalendarTop;
