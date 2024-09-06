import dotenv from 'dotenv'
import connectDB from './Database/db.js';

dotenv.config();
connectDB();



// Database Connection Methods old versions
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