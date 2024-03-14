import nodemailer from 'nodemailer';
import AuthCode from '../schemas/auth.js';

const sendOTP = async (req, res) => {
    const { roll, email } = req.body;

    try {
        const authCode = generateAuthCode();

        let Auth = await AuthCode.findOne({ roll });

        if (!Auth) {
            await AuthCode.create({ roll, authCode });
        } else {
            Auth.authCode = authCode;
            await Auth.save();
        }

        let transporter = nodemailer.createTransport({
            host: 'mmtp.iitk.ac.in',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from: 'DBMS IITK<yashps22@iitk.ac.in>',
            to: email,
            subject: 'DBMS Registration OTP',
            html: `<div>Hello,<br/>This is your registration OTP: <code><b>${authCode}</b></code> for DBMS (Dhobhi Management System).</div>`,
        });

        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ message: 'Registration OTP sent successfully' });
    } catch (error) {
        console.error('Error sending registration OTP:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

function generateAuthCode() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
}

const mailer = { sendOTP };

export default mailer;