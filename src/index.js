import dotenv from 'dotenv'
import {connectDB} from './Database/db.js';
import {app} from './app.js';
// import { Connection } from 'mongoose';

dotenv.config({
    path: './.env'
});


const startServer = async () => {
    try {
        // Connect to the database
        await connectDB();  // Assuming connectDB is an asynchronous function

        // Start your Express server after the DB connection
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.error('Error starting the server or connecting to the database:', error);
        process.exit(1);  // Exit the process if there is a failure
    }
};

// Call the startServer function
startServer();



































// Database Connection Methods old versions we not use bcz not mess in index.js files anymore but it's working appropriately
// const app = express();
// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on('error',(error) => {
//             console.error('MongoDB connection error:', error);
//             throw Error
//         })
//         app.listen(process.env.PORT,() => {
//             console.log(`Server running on port ${process.env.PORT}`);
//         });
//         console.log(`Connected to MongoDB ${DB_NAME}`);
//     } catch (error) {
//         console.error(`Error connecting to MongoDB: ${error.message}`);
//         process.exit(1);
//     }
// })