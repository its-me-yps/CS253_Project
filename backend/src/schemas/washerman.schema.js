import mongoose from 'mongoose';

const washermanSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    gender: { type: String, required: true },
    studentIds: [{ type: mongoose.Schema.Types.ObjectId }],
}, { timestamps: true });

const Washerman = mongoose.model('Washerman', washermanSchema);

export default Washerman;