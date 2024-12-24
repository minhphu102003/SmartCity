import multer from "multer";
import cloudinary from "../../../config/cloudinary.config.js";
import { MAX_FILE_SIZE, MAX_FILE_COUNT } from "../constants/uploadConstants.js";

// Set up memory storage for Multer
const storage = multer.memoryStorage();

// Use Multer with memory storage configuration
const uploadMultiple = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE }, // Limit for each file
}).array("files", MAX_FILE_COUNT); // Allow multiple files

// Upload files directly to Cloudinary
export const handleMultipleUploads = async (req, res, next) => {
  uploadMultiple(req, res, async function (err) {
    if (err) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            type: "field",
            msg: err.message,
            path: "",
            location: "body",
          },
        ],
      });
    }

    try {
      // Promise wrapper for upload_stream
      const uploadToCloudinary = (fileBuffer, uniquePublicId) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "uploads", // Folder in Cloudinary
              public_id: uniquePublicId, // Unique public ID
              overwrite: true, // Overwrite if name conflicts
            },
            (error, result) => {
              if (error) {
                reject(error); // Handle upload error
              } else {
                resolve(result); // Resolve with result
              }
            }
          );
          stream.end(fileBuffer); // Send buffer data
        });
      };

      const uploadPromises = req.files.map((file) => {
        const uniquePublicId = Date.now(); // Generate unique public ID
        return uploadToCloudinary(file.buffer, uniquePublicId);
      });

      const uploadResults = await Promise.all(uploadPromises);

      // Store URLs of uploaded images in request body
      req.body.uploadedImages = uploadResults.map((result) => result.secure_url);
      console.log(req.body.uploadedImages); // Debug uploaded URLs
      next(); // Proceed to the next middleware
    } catch (uploadError) {
      console.error("Error uploading to Cloudinary:", uploadError);
      res.status(500).json({
        success: false,
        errors: [
          {
            type: "field",
            msg: "Error uploading images to Cloudinary.",
            path: "",
            location: "body",
          },
        ],
      });
    }
  });
};

// Use Multer with memory storage configuration for a single file
const uploadSingle = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE }, // Limit for the file
}).single("img"); // Allow a single file

// Upload single file directly to Cloudinary
export const handleSingleUpload = async (req, res, next) => {
  uploadSingle(req, res, async function (err) {
    if (err) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            type: "field",
            msg: err.message,
            path: "",
            location: "body",
          },
        ],
      });
    }

    try {
      // Promise wrapper for upload_stream
      const uploadToCloudinary = (fileBuffer, uniquePublicId) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "uploads", // Folder in Cloudinary
              public_id: uniquePublicId, // Unique public ID
              overwrite: true, // Overwrite if name conflicts
            },
            (error, result) => {
              if (error) {
                reject(error); // Handle upload error
              } else {
                resolve(result); // Resolve with result
              }
            }
          );
          stream.end(fileBuffer); // Send buffer data
        });
      };

      // Generate a unique public ID for the uploaded image
      const uniquePublicId = Date.now(); // You can adjust this ID as per your requirement

      // Upload the file to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.buffer, uniquePublicId);

      // Store the URL of the uploaded image in request body
      req.body.uploadedImage = uploadResult.secure_url;
      console.log(req.body.uploadedImage); // Debug uploaded URL
      next(); // Proceed to the next middleware
    } catch (uploadError) {
      console.error("Error uploading to Cloudinary:", uploadError);
      res.status(500).json({
        success: false,
        errors: [
          {
            type: "field",
            msg: "Error uploading image to Cloudinary.",
            path: "",
            location: "body",
          },
        ],
      });
    }
  });
};
