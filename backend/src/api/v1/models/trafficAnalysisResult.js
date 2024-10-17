import mongoose from "mongoose";
import { CongestionLevels } from '../constants/enum.js';

const trafficAnalysisResultSchema = new mongoose.Schema(
  {
    userReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserReport", // Liên kết tới UserReport
      required: true,
    },
    congestionLevel: {
      type: String,
      enum: Object.values(CongestionLevels), // Sử dụng enum từ file enums
      default: null,
    },
    processedTime: {
      type: Date,
      default: Date.now, // Thời gian phân tích hoàn thành
      required: true,
    },
    additionalInfo: {
      type: String,
      default: null, // Thông tin bổ sung như nguyên nhân, dữ liệu thời tiết
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
    versionKey: false,
  }
);

export default mongoose.model("TrafficAnalysisResult", trafficAnalysisResultSchema);
