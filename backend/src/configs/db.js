import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/DBMS`;
        await mongoose.connect(uri);
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
        throw error;
    }
};

export default connectDB;