import NotificationImportantSharpIcon from '@mui/icons-material/NotificationImportantSharp'; 
import Button from '@mui/material/Button'; 
import './notification.css';

const Notification = () => {
    return (
        <div className=''>
            <Button variant='contained'
                color='secondary'
                startIcon={<NotificationImportantSharpIcon />}
                className='notification-button'
            >
                Notification
            </Button>
        </div>
    );
};

export default Notification;
