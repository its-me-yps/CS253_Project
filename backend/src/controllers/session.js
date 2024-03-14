import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Student from '../schemas/student.js';
import Washerman from '../schemas/washerman.js';

const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        res.status(500).json({message: 'Bad Request (Wrong/Missing Keys in json)'});
        return;
    }
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: 'Admin logged in successfully' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

const userLogin = async (req, res) => {
    const { rollORid, pass, type } = req.body;
    
    try {
        let user;
        
        if (type === 'student') {
            user = await Student.findOne({ roll:rollORid });
        } else if (type === 'washerman') {
            user = await Washerman.findOne({ id:rollORid });
        } else {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const hashedpass = sha256(pass);

        if (user.passHash === hashedpass) {
            const token = jwt.sign({ rollORid, type }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            res.status(200).json({ message: 'User logged in successfully' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

const session = { adminLogin, userLogin, logout };

export default session;