import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const studentSchema = new mongoose.Schema({
    roll: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    // IITK webmail
    email: { type: String, required: true, unique: true },
    hall: { type: String, required: true },
    wing: { type: String, required: true },
    // SHA256 of Password
    passHash: { type: String, required: true },
    washerman: { type: mongoose.Schema.Types.ObjectId, ref: 'Washerman', required: true },
    records: [{
        date: { type: Date, required: true },
        // Array of pair(type of cloth and number of units) in clothes
        clothes: [{ type: { type: String, required: true }, quantity: { type: Number, required: true } }],
    }],
    // last date whose dues were cleared, charges for all clothes after that are added in dueAmount
    lastCleared : { type: Date },
    receipts: [receiptSchema], 
    dueAmount: { type: Number, required: true }
}, { timestamps: true });

const Student = new mongoose.model('Student', studentSchema);
export default Student;