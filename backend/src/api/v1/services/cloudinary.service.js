import multer from "multer";
import cloudinary from "../config/cloudinary.config.js";
import { MAX_FILE_SIZE, MAX_FILE_COUNT } from "../constants/uploadConstants.js";

const storage = multer.memoryStorage();

const uploadMultiple = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
}).array("files", MAX_FILE_COUNT); 

export const handleMultipleUploads = async (req, res, next) => {
  uploadMultiple(req, res, async function (err) {
    if (err) {
      console.log('debug');
      console.log(err);
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
      const uploadToCloudinary = (fileBuffer, uniquePublicId) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "uploads", 
              public_id: uniquePublicId, 
              overwrite: true, 
            },
            (error, result) => {
              if (error) {
                reject(error); 
              } else {
                resolve(result);
              }
            }
          );
          stream.end(fileBuffer); 
        });
      };

      const uploadPromises = req.files.map((file) => {
        const uniquePublicId = Date.now(); 
        return uploadToCloudinary(file.buffer, uniquePublicId);
      });

      const uploadResults = await Promise.all(uploadPromises);

      req.body.uploadedImages = uploadResults.map((result) => result.secure_url);
      console.log(req.body.uploadedImages);
      next(); 
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

const uploadSingle = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE }, 
}).single("img");

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
      const uploadToCloudinary = (fileBuffer, uniquePublicId) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "uploads", 
              public_id: uniquePublicId, 
              overwrite: true, 
            },
            (error, result) => {
              if (error) {
                reject(error); 
              } else {
                resolve(result); 
              }
            }
          );
          stream.end(fileBuffer); 
        });
      };

      const uniquePublicId = Date.now(); 

      const uploadResult = await uploadToCloudinary(req.file.buffer, uniquePublicId);

      req.body.uploadedImage = uploadResult.secure_url;
      next(); 
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
