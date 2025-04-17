import multer from "multer";
import cloudinary from "../config/cloudinary.config.js";
import { MAX_FILE_VIDEO_SIZE } from "../../shared/constants/upload.js";
import s3 from "../config/s3.config.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import dotenv from "dotenv";
import { createAccountReportV2Controller } from '../controllers/accountReport.controller.js';

dotenv.config();

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

export const handleUploadVideoMulter = (req, res, next) => {
  uploadVideoMulter(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Failed to process uploaded video",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No video file uploaded",
      });
    }

    next();
  });
};

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


export const handleVideoUploadToS3 = (req, res, next) => {
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

    const fileExt = path.extname(req.file.originalname);
    const fileName = `video_${uuidv4()}${fileExt}`;
    const bucketName = process.env.S3_BUCKET_NAME;

    const uploadParams = {
      Bucket: bucketName,
      Key: `videos/${fileName}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    try {

      res.status(200).json({
        success: true,
        message: "Video uploaded and report is being processed",
      });

      await s3.send(new PutObjectCommand(uploadParams));
      const videoUrl = `https://${bucketName}.s3.amazonaws.com/videos/${fileName}`;

      setImmediate(() => {
        const mockReq = {
          ...req,
          body: {
            ...req.body,
            uploadedVideo: videoUrl,
          },
        };

        const mockRes = {
          status: () => ({
            json: () => {}, 
          }),
        };

        createAccountReportV2Controller(mockReq, mockRes);
      });

    } catch (error) {
      console.error("S3 upload error:", error);
      return res.status(500).json({
        success: false,
        message: "Error uploading video to S3",
      });
    }
  });
};
