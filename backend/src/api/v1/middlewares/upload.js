import multer from "multer";
import path from "path";
import { UPLOAD_DIRECTORY, MAX_FILE_SIZE, MAX_FILE_COUNT } from "../constants/uploadConstants.js";

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIRECTORY); // Directory for storing images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// Upload multiple files
const uploadMultiple = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE }, // Limit for each file
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only image files (JPEG, JPG, PNG, GIF) are allowed."));
    }
    cb(null, true);
  },
}).array("files", MAX_FILE_COUNT); // Allow multiple files

// Upload a single file
const uploadSingle = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE }, // Limit for the file
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only image files (JPEG, JPG, PNG, GIF) are allowed."));
    }
    cb(null, true);
  },
}).single("img"); // Allow a single file

// Middleware to handle multiple uploads
export const handleMultipleUploads = (req, res, next) => {
  uploadMultiple(req, res, function (err) {
    if (err) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            type: "field",
            msg: err.message,
            path: "",
            location: "body"
          }
        ]
      });
    }
    next();
  });
};

// Middleware to handle single upload
export const handleSingleUpload = (req, res, next) => {
  uploadSingle(req, res, function (err) {
    if (err) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            type: "field",
            msg: err.message,
            path: "",
            location: "body"
          }
        ]
      });
    }
    next();
  });
};