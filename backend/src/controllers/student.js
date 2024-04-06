import crypto from 'crypto';
import Student from '../schemas/student.js';
import AuthCode from '../schemas/auth.js';
import Data from '../schemas/data.js'
import pay from '../payment/pay.js';
import Washerman from '../schemas/washerman.js';
import jwt from 'jsonwebtoken';


// Function to fetch the upcoming date from the washerman assigned to the student
const fetchUpcomingDate = async (req, res) => {
    try {
        const student = await Student.findOne({ roll: req.user.roll }).populate('washerman');
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const washerman = student.washerman;
        if (!washerman) {
            return res.status(404).json({ success: false, message: 'Washerman not assigned to the student' });
        }

        return res.status(200).json({ success: true, upcomingDate: washerman.upcomingDate });
    } catch (error) {
        console.error('Error fetching upcoming date:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

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

        const wingObject = await Data.Wing.findOne({ parentHall: hall, name: wing });
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
            // Student's wing was alloted to this washerman by admin
            washerman: wingObject.washerman
        });
        // Save the new student to the database
        await newStudent.save();

        wingObject.students.push(newStudent._id);
        await wingObject.save();

        res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
        console.error('Error registering student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const requestWash = async (req, res) => {
    try {
        const student = await Student.findOne({ roll: req.user.roll }).populate('washerman');
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const { clothes } = req.body;

        const currentDate = new Date().toDateString();
        const existingRecordIndex = student.records.findIndex(record => {
            return record.date.toDateString() === currentDate && !record.accept;
        });

        if (existingRecordIndex !== -1) {
            student.records[existingRecordIndex].clothes = clothes.map(cloth => ({ type: cloth.type, quantity: cloth.quantity }));
            await student.save();
            return res.status(200).json({ success: true, message: 'Update success' });
        }

        const existingAcceptedRecordIndex = student.records.findIndex(record => {
            return record.date.toDateString() === currentDate && record.accept;
        });

        if (existingAcceptedRecordIndex !== -1) {
            return res.status(400).json({ success: false, message: 'Request already accepted' });
        }

        // Calculate total amount for the current wash request
        const totalAmount = clothes.reduce((acc, cloth) => {
        
            const clothPrice = 10; // Example price per cloth unit
            return acc + (cloth.quantity * clothPrice);
        }, 0);

        // Add the total amount to the existing due amount
        student.dueAmount += totalAmount;

        const record = {
            date: new Date(),
            clothes: clothes.map(cloth => ({ type: cloth.type, quantity: cloth.quantity })),
            accept: false
        };

        student.records.push(record);
        await student.save();

        res.status(200).json({ success: true, message: 'Request sent successfully', totalAmount: totalAmount });

    } catch (error) {
        console.error('Error handling requestWash:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const fetchDates = async (req, res) => {
    try {
        const student = await Student.findOne({ roll: req.user.roll });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const dates = student.records.map(record => record.date.toDateString());

        return res.status(200).json({ success: true, dates });
    } catch (error) {
        console.error('Error fetching dates:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const clearDue = async (req, res) => {
    try {
        const student = await Student.findOne({ roll: req.user.roll }).populate('washerman');
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

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
        const clothesForDate = recordForDate.map(record => ({
            clothes: record.clothes,
            accept: record.accept
        })).flat();

        return res.status(200).json({ success: true, clothes: clothesForDate });
    } catch (error) {
        console.error('Error fetching records:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const fetchReceipt = async (req, res) => {
    const { date } = req.body;

    try {
        const student = await Student.findOne({ roll: req.user.roll });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Getting receipts for the requested date
        const receiptsForDate = student.receipts.filter(receipt => {
            const receiptDate = new Date(receipt.timestamp);
            const queryDate = new Date(date);
            return receiptDate.toDateString() === queryDate.toDateString();
        });

        return res.status(200).json({ success: true, receipts: receiptsForDate });
    } catch (error) {
        console.error('Error fetching receipts:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const paymentDates = async (req, res) => {
    try {
        const student = await Student.findOne({ roll: req.user.roll });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const paymentDates = student.receipts.map(receipt => receipt.timestamp.toDateString());

        return res.status(200).json({ success: true, paymentDates });
    } catch (error) {
        console.error('Error fetching payment dates:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
//reset password
export const resetPassword = async (req, res) => {
    const { roll, email, newPass,authCode } = req.body;

    try {
        // Find the student by roll or email
        const student = await Student.findOne({ $and: [{ roll }, { email }] });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        // Verify authentication code
        const storedAuthCode = await AuthCode.findOne({ $or: [{ roll }, { email }] });
        if (!storedAuthCode || storedAuthCode.authCode !== authCode) {
            return res.status(400).json({ message: 'Invalid authentication code' });
        }
        // Generate a new password hash
        const passHash = sha256(newPass);

        // Update the student's password hash
        student.passHash = passHash;
        await student.save();
        console.log("done");
        // Delete the authentication code from the database
        await AuthCode.deleteOne({ _id: storedAuthCode._id });

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
};

const student = { register, requestWash ,fetchDates, clearDue, fetchRecord, fetchReceipt, paymentDates,resetPassword,fetchUpcomingDate};

export default student;

