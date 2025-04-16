import s3 from "../api/v2/config/s3.config.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { EXTRACT_IMAGE_TOPIC } from "../api/v2/constants/kafka.js";
import { produceMessage } from "./kafka.js";
import path from "path";
import AccountReport from "../api/v2/models/accountReport.js";

export const handleImageUploadConsumer = async ({ message }) => {
  try {
    const { reportId, buffer, mimeType, originalName } = JSON.parse(message.value.toString());

    const fileExt = path.extname(originalName);
    const fileName = `video_${reportId}${fileExt}`;
    const imageBuffer = Buffer.from(buffer, "base64");

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `video/${fileName}`,
      Body: imageBuffer,
      ContentType: mimeType,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const videoUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/video/${fileName}`;

    const updatedReport = await AccountReport.findByIdAndUpdate(
      reportId,
      { "media_files.media_url": videoUrl },
      { new: true }
    );

    if (!updatedReport) {
      console.error(`❌ Report with ID ${reportId} not found`);
      return;
    }

    await produceMessage(EXTRACT_IMAGE_TOPIC, updatedReport.toObject(), "Send updated report to extract");

    console.log(`✅ Uploaded image for report ${reportId} and updated database`);
  } catch (err) {
    console.error("❌ Failed to upload image from Kafka message:", err);
  }
};