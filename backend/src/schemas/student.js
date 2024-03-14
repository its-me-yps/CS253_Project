import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    roll: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    // IITK webmail
    email: { type: String, required: true, unique: true },
    hall: { type: String, required: true },
    wing: { type: String, required: true },
    // SHA256 of Password
    passHash: { type: String, required: true },
    washermanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Washerman' },
    record: [{
      date: { type: Date, required: true },
      // Array of pair(type of cloth and number of units) in clothes
      clothes: [{ type: { type: String, required: true }, quantity: { type: Number, required: true } }],
    }],
    // last date whose dues were cleared, charges for all clothes after that are added in dueAmount
    lastCleared : { type: Date },
    dueAmount: { type: Number, required: true }
}, { timestamps: true });

const Student = new mongoose.model('Student', studentSchema);
export default Student;