import crypto from 'crypto';
import Student from '../schemas/student.js';
import AuthCode from '../schemas/auth.js';
import Data from '../schemas/data.js'
import pay from '../payment/pay.js';

export const register = async (req, res) => {
    const { roll, name, email, hall, wing, pass, authCode } = req.body;

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
            roll,
            name,
            email,
            hall,
            wing,
            passHash,
            dueAmount: 0,
            // Student's wing was alloted to this washerman by admin
            washerman: wingObject.washerman
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

const clearDue = async (req, res) => {
    try {
        const student = await Student.findOne({ roll: req.user.roll }).populate('washerman');

        // No Due
        if (student.dueAmount === 0) {
            return res.status(400).json({ success: false, message: 'No dues to clear' });
        }

        // Creating a payment order to razor pay
        const order = await pay.createOrder(student.dueAmount, 'INR', student.washerman.accountID, 'Clothes Due Clearance');

        return res.status(200).json({ success: true, message: 'Order created successfully', order });
    } catch (error) {
        console.error('Error in clearing dues:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const fetchRecord = async (req, res) => {
    const { date } = req.body;

    try {
        const student = await Student.findOne({ roll: req.user.roll });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // getting record of requested date
        const recordForDate = student.records.filter(record => {
            const recordDate = new Date(record.date);
            const queryDate = new Date(date);
            return recordDate.toDateString() === queryDate.toDateString();
        });

        // clothes given on that date
        const clothesForDate = recordForDate.map(record => record.clothes).flat();

        return res.status(200).json({ success: true, clothes: clothesForDate });
    } catch (error) {
        console.error('Error fetching records:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

const student = { register, clearDue, fetchRecord };

export default student;