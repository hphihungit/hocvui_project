import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import cookieParser from 'cookie-parser';

import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());

app.use('/posts', postRoutes);
app.use('/user', userRoutes)

// connect db
const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log('Server is running: ', PORT)))
    .catch((error) => {
        console.log(error.message);
    })

