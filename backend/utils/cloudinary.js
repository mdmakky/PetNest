const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const { cloudName, apiKey, apiSecret } = require("../config/env");

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});

async function uploadImageToCloudinary(fileBuffer, folderName, fileName = null, generateUniqueId = true) {
    try {
        const uploadOptions = {
            folder: `petnest/${folderName}`,
        };

        if (generateUniqueId && fileName) {
            const uniqueId = uuidv4();
            uploadOptions.public_id = `${fileName}-${uniqueId}`;
        } else if (fileName) {
            
            uploadOptions.public_id = fileName;
        }

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            });
            uploadStream.end(fileBuffer);
        });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

module.exports = { uploadImageToCloudinary };
