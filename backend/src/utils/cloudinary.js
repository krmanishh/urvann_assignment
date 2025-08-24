import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from "fs";

dotenv.config(); // Load env vars

// Cloudinary Configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// File Upload Function
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "plants",
      resource_type: "auto"
    });

    // Delete local file after upload
    fs.unlinkSync(localFilePath);

    // Return only secure URL
    return response.secure_url;

  } catch (error) {
    // Cleanup in case of failure
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

export { uploadOnCloudinary };
