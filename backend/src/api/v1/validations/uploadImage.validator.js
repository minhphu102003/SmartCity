import { check, validationResult } from "express-validator";

export const validateUploadMultipleFile = (req, res, next) => {
  const errors = [];
  // Check if any files were uploaded
  if (!req.files || req.files.length === 0) {
    errors.push({ msg: "At least one file upload is required." });
  } else {
    // Allowed MIME types for images
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

    // Check if all uploaded files are images
    const invalidFiles = req.files.filter(
      (file) => !allowedMimeTypes.includes(file.mimetype)
    );

    if (invalidFiles.length > 0) {
      errors.push({ msg: "Only image files (JPG, PNG, GIF) are allowed." });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

export const validateUploadSingleFile = (req, res, next) => {
  const errors = [];

  // Check if a file was uploaded
  if (!req.file) {
    errors.push({ msg: "A file upload is required." });
  } else {
    // Allowed MIME types for images
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

    // Check if the uploaded file is an image
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      errors.push({
        msg: "Only image files (JPEG, JPG, PNG, GIF) are allowed.",
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};
