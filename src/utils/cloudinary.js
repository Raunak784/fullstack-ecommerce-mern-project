// hame import only v2 hi karna tha but hame usko apne taraf se name de diya cloudinary "as" lga kar 
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if (!localFilePath) return null;
            //Upload the file on cloudinary server
            const response = await cloudinary.uploader.upload(localFilePath, {resource_type: 'auto'});
            //file has been successfully uploaded
            console.log("file uploaded on cloudinary server", response.url)
            return response;

        } catch (error) {
            fs.unlink(localFilePath);
            //remove the locally saved temporary file as the upload operation got failed
        }
    }

    export {uploadOnCloudinary}