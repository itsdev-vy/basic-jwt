import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/index.js';
import cors from 'cors';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));


//routes import
import userRouter from "./routes/user.route.js";


//routes declaration
app.use("/api/v1/user", userRouter);


connectDB()
    .then(() => {
        console.log('Database connected');
        app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
