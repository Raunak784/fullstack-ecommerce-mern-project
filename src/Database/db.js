import mongoose from 'mongoose';
import express from 'express';
import { DB_NAME } from '../constants.js';

    const app = express();

const connectDB = async () => {
    try {
        const ConnectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB Connected to ${DB_NAME} !! DB HOST: ${ConnectionInstance.connection.host}`)

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
    catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message} `);
        process.exit(1);
    }
}

export default connectDB;