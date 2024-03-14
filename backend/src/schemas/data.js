import mongoose from 'mongoose';

const wingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    washerman: { type: mongoose.Schema.Types.ObjectId, ref: 'Washerman'}
});

const hallSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    wings: [wingSchema]
});

const Hall = new mongoose.model('Hall', hallSchema);

const Data = { Hall };
export default Data;