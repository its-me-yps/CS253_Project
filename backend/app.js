import express from 'express';
import connectDB from './src/configs/db.config.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

const app = express();
// Parsing json requests
app.use(bodyParser.json());

// Loading env variables
dotenv.config();

// Server Port
const PORT = process.env.PORT;

// Connecting to mongodb Atlas then running Server
connectDB().then(db => {
    app.locals.db = db;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
});