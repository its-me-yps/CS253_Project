import { MongoClient } from 'mongodb';

const connectDB = async () => {
    try {
        const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}`;
        const client = new MongoClient(uri);

        await client.connect();
        console.log('Connected to MongoDB Atlas');

        const dbName = 'DBMS';
        const db = client.db(dbName);
        console.log(`Database "${dbName}" created`);

        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
        throw error;
    }
};

export default connectDB;
