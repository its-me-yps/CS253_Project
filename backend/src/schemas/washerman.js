import mongoose from 'mongoose';

const washermanSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    passHash: { type: String, required: true},
    halls: [{
        name: { type: String, required: true },
        wings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wing' }]
    }],
    upcomingDate: { type: Date, required: true },
    upiID: {type: String, required: true}
}, { timestamps: true });

const Washerman = new mongoose.model('Washerman', washermanSchema);
export default Washerman;