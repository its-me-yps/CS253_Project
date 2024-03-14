import crypto from 'crypto';
import Student from '../schemas/student.js';
import AuthCode from '../schemas/auth.js';
import Data from '../schemas/data.js'

export const register = async (req, res) => {
    const { roll, name, email, hall, wing, gender, pass, authCode } = req.body;

    try {
        const existingStudent = await Student.findOne({ $or: [{ roll }, { email }] });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student with the same ID or email already exists' });
        }

        // Verify authentication code
        const storedAuthCode = await AuthCode.findOne({ roll });
        if (!storedAuthCode || storedAuthCode.authCode !== authCode) {
            return res.status(400).json({ message: 'Invalid authentication code' });
        }

        const hallObject = await Data.Hall.findOne({ name: hall });
        if (!hallObject) {
            return res.status(400).json({ message: 'Hall does not exist' });
        }

        const wingObject = hallObject.wings.find(w => w.name === wing);
        if (!wingObject) {
            return res.status(400).json({ message: 'Wing does not exist in the specified hall' });
        }

        // Hash the password using SHA256
        const passHash = sha256(pass);

        // Create a new student object
        const newStudent = new Student({
            id,
            name,
            email,
            hall,
            wing,
            gender,
            passHash,
            dueAmount: 0
        });

        // Save the new student to the database
        await newStudent.save();

        wingObject.students.push(newStudent._id);
        await hallObject.save();

        res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
        console.error('Error registering student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

const student = { register };

export default student;