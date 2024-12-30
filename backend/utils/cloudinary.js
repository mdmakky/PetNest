const cloudinary = require('cloudinary').v2;
const { cloudName, apiKey, apiSecret} = require("../config/env")

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
});

async function uploadImageToCloudinary(fileBuffer, fileName = null) {
    try {
        const uploadOptions = {
            folder: 'petnest',
        };

        if (fileName) {
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