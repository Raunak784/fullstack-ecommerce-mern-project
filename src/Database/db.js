// import mongoose from 'mongoose';
// import mysql from 'mysql';
// import { DB_NAME } from '../constants.js';


// const connectDB = async () => {
//     try {
//         const ConnectionInstance = await mysql.createConnection({
//             host: 'localhost',
//             user: 'raunak',
//             password: 'Raunak@12345',
//             database: DB_NAME
//         });

//         ConnectionInstance.connect(function (err){
//             if (err) throw err;
//             console.log('Connected to MySQL');
//         });
//         // const ConnectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         // console.log(`MongoDB Connected to ${DB_NAME} !! DB HOST: ${ConnectionInstance.connection.host}`)  
//     }
//     catch (error) {
//         console.error(`Error connecting to Mysql: ${error.message} `);
//         process.exit(1);

//         // console.error(`Error connecting to MongoDB: ${error.message} `);
//         // process.exit(1);
//     }
// }

// export default connectDB;




import mysql from 'mysql';
import { DB_NAME } from '../constants.js'; 

let ConnectionInstance;

const connectDB = () => {
    return new Promise((resolve, reject) => {
        ConnectionInstance = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: DB_NAME
        });

        // Connect to MySQL database
        ConnectionInstance.connect((err) => {
            if (err) {
                console.error(`Error connecting to MySQL: ${err.message}`);
                reject(err);  // Reject the promise on error
            } else {
                console.log(`Connected to MySQL database: ${DB_NAME}`);
                resolve(ConnectionInstance);  // Resolve the promise on success
            }
        });
    });
};

export { connectDB, ConnectionInstance };


