import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env

cloudinary.config({
    cloud_name: 'dvrisaqgy',
    api_key: '816794745326251',
    api_secret: process.env.CLOUDINARY_API_SECRET, // Đặt API secret vào file .env
});

export default cloudinary;
