import mongoose from "mongoose";
import { CongestionLevels } from '../constants/enum.js';

const roadSegmentSchema = new mongoose.Schema(
    {
      roadName: {
        type: String,
      },
      start_location: {
        type: {
          type: String,
          enum: ["Point"],
          required: true,
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
      end_location: {
        type: {
          type: String,
          enum: ["Point"],
          required: true,
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
      roadSegmentLine: { // Thêm trường này để lưu trữ đoạn đường dạng LineString
        type: {
          type: String,
          enum: ["LineString"],
          required: true,
        },
        coordinates: {
          type: [[Number]], // Array of [longitude, latitude] pairs
          required: true,
        },
      },
      reports: [
        {
          type: mongoose.Schema.Types.ObjectId, // Tham chiếu tới CameraReport
          ref: "CameraReport", // Tên model được tham chiếu
        },
      ],
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );
  
  // Tạo index 2dsphere cho trường coordinates
  roadSegmentSchema.index({ "start_location": "2dsphere" });
  roadSegmentSchema.index({ "end_location": "2dsphere" });
  
  export default mongoose.model("RoadSegment", roadSegmentSchema);