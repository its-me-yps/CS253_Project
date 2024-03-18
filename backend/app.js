import express from 'express';
import connectDB from './src/configs/db.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './src/routes/router.js'
import morgan from 'morgan';
import nodemon from 'nodemon';
import cors from 'cors';

const app = express();
// Parsing json requests
app.use(bodyParser.json());
app.use(cookieParser());

// Loading env variables
dotenv.config();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
};
app.use(cors(corsOptions));

// Use Morgan for HTTP request logging
app.use(morgan('dev'));

console.log("DBMS Backend Service");
// Server Port
const PORT = process.env.PORT;

app.use(router);

// Connecting to mongodb Atlas then running Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
});

nodemon({
    ext: 'js',
    ignore: ['node_modules/'] // Ignore changes in the node_modules directory
});

