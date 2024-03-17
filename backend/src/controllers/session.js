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
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '12h' });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: 'Admin logged in successfully' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

const studentLogin = async (req, res) => {
    const { roll, pass } = req.body;
    
    try {
        let user;

        user = await Student.findOne({ roll:roll }).populate('washerman');

        if (!user) {
            return res.status(401).json({ message: 'student not found' });
        }

        const hashedpass = sha256(pass);

        if (user.passHash === hashedpass) {
            const token = jwt.sign({ roll }, process.env.JWT_SECRET, { expiresIn: '12h' });
            res.cookie('token', token, { httpOnly: true });

            res.cookie('info', JSON.stringify({
                roll,
                name: user.name,
                hall: user.hall,
                wing: user.wing,
                washerman: {
                    name: user.washerman.name,
                    upcomingDate: user.washerman.upcomingDate,
                    contact: user.washerman.contact
                }
            }), { httpOnly: true });

            res.status(200).json({ message: 'student logged in successfully' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const washermanLogin = async (req, res) => {
    const { contact, pass } = req.body;
    
    try {
        let user;

        user = await Washerman.findOne({ contact:contact });

        if (!user) {
            return res.status(401).json({ message: 'washerman not found' });
        }

        const hashedpass = sha256(pass);

        if (user.passHash === hashedpass) {
            const token = jwt.sign({ contact }, process.env.JWT_SECRET, { expiresIn: '12h' });
            res.cookie('token', token, { httpOnly: true });

            res.cookie('info', JSON.stringify({
                contact,
                name: user.name,
            }), { httpOnly: true });

            res.status(200).json({ message: 'washerman logged in successfully' });
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
    res.clearCookie('info')
    res.status(200).json({ message: 'Logged out successfully' });
};

function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

const session = { adminLogin, studentLogin, washermanLogin, logout };

export default session;