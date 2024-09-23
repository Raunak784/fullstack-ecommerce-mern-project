// import asyncHandler from "../utils/asyncHandler.js"
// import { ApiError } from "../utils/ApiError.js"
// import { User } from "../models/user.model.js"
// import { uploadOnCloudinary } from "../utils/cloudinary.js"
// import { ApiResponse } from "../utils/ApiResponse.js";

// const registerUser = asyncHandler(async (req, res) => {

//     // get user details from frontend
//     // validation - not empty
//     // check if user already exists: username, email
//     // check for images, check for avatar
//     // upload them to cloudinary, avatar
//     // create user object - create entry in db
//     // remove password and refresh token field from response
//     // check for user creation
//     // return res

//     const { u_name, u_email, u_password, u_contact, u_status } = req.body
//     //console.log("email: ", email);

//     if (
//         [u_name, u_email, u_password, u_contact, u_status].some((field) => field?.trim() === "")
//     ) {
//         throw new ApiError(400, "All fields are required")
//     }

//     const existedUser = await User.findOne({
//         $or: [{ u_contact }, { u_email }]
//     })

//     if (existedUser) {
//         throw new ApiError(409, "User with email or username already exists")
//     }
//     //console.log(req.files);

//     const avatarLocalPath = req.files?.avatar[0]?.path;
//     //const coverImageLocalPath = req.files?.coverImage[0]?.path;

//     // let coverImageLocalPath;
//     // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
//     //     coverImageLocalPath = req.files.coverImage[0].path
//     // }


//     if (!avatarLocalPath) {
//         throw new ApiError(400, "Avatar file is required")
//     }

//     const avatar = await uploadOnCloudinary(avatarLocalPath)
//     // const coverImage = await uploadOnCloudinary(coverImageLocalPath)

//     if (!avatar) {
//         throw new ApiError(400, "Avatar file is required")
//     }
    
//     const user = await User.create({
//         u_name,
//         avatar: avatar.url,
//         // coverImage: coverImage?.url || "",
//         u_email,
//         u_password,
//         u_contact,
//     })

//     const createdUser = await User.findById(user._id).select(
//         "-password -refreshToken"
//     )

//     if (!createdUser) {
//         throw new ApiError(500, "Something went wrong while registering the user")
//     }

//     return res.status(201).json(
//         new ApiResponse(201, createdUser, "User registered Successfully")
//     )

// });

// export {
//     registerUser
// }




import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ConnectionInstance } from '../Database/db.js';
import bcrypt from 'bcrypt';

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { u_name, u_email, u_password, u_contact, u_status } = req.body;

    if ([u_name, u_email, u_password, u_contact, u_status].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const checkUserQuery = `SELECT * FROM user WHERE u_email = ? OR u_contact = ?`;
    const existingUser = await new Promise((resolve, reject) => {
        ConnectionInstance.query(checkUserQuery, [u_email, u_contact], (err, results) => {
            if (err) return reject(new ApiError(500, "Database query failed"));
            resolve(results);
        });
    });

    if (existingUser.length > 0) {
        throw new ApiError(409, "User with email or contact already exists");
    }

    const hashedPassword = await bcrypt.hash(u_password, 10);
    const insertUserQuery = `INSERT INTO user (u_name, u_email, u_password, u_contact, u_status) VALUES (?, ?, ?, ?, ?)`;
    const userValues = [u_name, u_email, hashedPassword, u_contact, u_status];

    const insertResult = await new Promise((resolve, reject) => {
        ConnectionInstance.query(insertUserQuery, userValues, (err, result) => {
            if (err) return reject(new ApiError(500, "Failed to register user"));
            resolve(result);
        });
    });

    const fetchUserQuery = `SELECT u_id, u_name, u_email, u_contact, u_status FROM user WHERE u_id = ?`;
    const newUser = await new Promise((resolve, reject) => {
        ConnectionInstance.query(fetchUserQuery, [insertResult.insertId], (err, results) => {
            if (err || results.length === 0) {
                return reject(new ApiError(500, "Something went wrong while registering the user"));
            }
            resolve(results[0]);
        });
    });

    return res.status(201).json(new ApiResponse(201, newUser, "User registered successfully"));
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { u_email, u_password } = req.body;

    if ([u_email, u_password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "Email and password are required");
    }

    const userQuery = `SELECT * FROM user WHERE u_email = ?`;
    const user = await new Promise((resolve, reject) => {
        ConnectionInstance.query(userQuery, [u_email], (err, results) => {
            if (err) return reject(new ApiError(500, "Database query failed"));
            resolve(results[0]);
        });
    });

    if (!user || !(await bcrypt.compare(u_password, user.u_password))) {
        throw new ApiError(401, "Invalid email or password");
    }

    return res.status(200).json(new ApiResponse(200, { u_id: user.u_id, u_name: user.u_name }, "Login successful"));
});

// Get Single User
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const userQuery = `SELECT u_id, u_name, u_email, u_contact, u_status FROM user WHERE u_id = ?`;
    const user = await new Promise((resolve, reject) => {
        ConnectionInstance.query(userQuery, [id], (err, results) => {
            if (err) return reject(new ApiError(500, "Database query failed"));
            resolve(results[0]);
        });
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, user, "User retrieved successfully"));
});

// Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
    const usersQuery = `SELECT u_id, u_name, u_email, u_contact, u_status FROM user`;
    const users = await new Promise((resolve, reject) => {
        ConnectionInstance.query(usersQuery, (err, results) => {
            if (err) return reject(new ApiError(500, "Database query failed"));
            resolve(results);
        });
    });

    return res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully"));
});

// Edit User
const editUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { u_name, u_email, u_contact, u_status } = req.body;

    const updateUserQuery = `
        UPDATE user SET u_name = ?, u_email = ?, u_contact = ?, u_status = ? WHERE u_id = ?
    `;
    const userValues = [u_name, u_email, u_contact, u_status, id];

    await new Promise((resolve, reject) => {
        ConnectionInstance.query(updateUserQuery, userValues, (err, result) => {
            if (err) return reject(new ApiError(500, "Failed to update user"));
            resolve(result);
        });
    });

    return res.status(200).json(new ApiResponse(200, null, "User updated successfully"));
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deleteUserQuery = `DELETE FROM user WHERE u_id = ?`;
    await new Promise((resolve, reject) => {
        ConnectionInstance.query(deleteUserQuery, [id], (err, result) => {
            if (err) return reject(new ApiError(500, "Failed to delete user"));
            if (result.affectedRows === 0) return reject(new ApiError(404, "User not found"));
            resolve(result);
        });
    });

    return res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

export {
    registerUser,
    loginUser,
    getUser,
    getAllUsers,
    editUser,
    deleteUser
};





 // Check if avatar file is provided
        // const avatarLocalPath = req.files?.avatar[0]?.path;
        // if (!avatarLocalPath) {
        //     throw new ApiError(400, "Avatar file is required");
        // }

        // // Upload avatar to Cloudinary
        // const avatar = await uploadOnCloudinary(avatarLocalPath);
        // if (!avatar) {
        //     throw new ApiError(400, "Failed to upload avatar");
        // }
