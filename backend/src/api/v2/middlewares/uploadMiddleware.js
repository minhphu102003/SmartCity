import multer from "multer";
import cloudinary from "../config/cloudinary.config.js";
import { MAX_FILE_VIDEO_SIZE } from "../../shared/constants/upload.js";

const uploadVideoMulter = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_VIDEO_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed!"), false);
    }
  },
}).single("video");

export const handleVideoUploadWithMaxSizeOnly = (req, res, next) => {
  uploadVideoMulter(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Failed to upload video",
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No video file uploaded" });
    }

    try {
      const uploadStream = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "video",
              folder: "videos",
              public_id: `video_${Date.now()}`,
              overwrite: true,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          stream.end(req.file.buffer);
        });

      const result = await uploadStream();

      req.body.uploadedVideo = result.secure_url;
      next();
    } catch (error) {
      console.error("Upload failed:", error);
      res.status(500).json({
        success: false,
        message: "Error processing video upload",
      });
    }
  });
};
