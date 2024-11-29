import mongoose from "mongoose";
import { CongestionLevels, ReportTypes } from '../constants/enum.js';

const imageUserReportSchema = new mongoose.Schema({
    img: {
      type: String,
      required: true, // Đường dẫn hoặc tên của ảnh
    },
});

const userReportSchema = new mongoose.Schema(
  {
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    description: {
      type: String,
      default: null, // Nếu người dùng có post mô tả
    },
    typeReport: {
      type: String,
      enum: Object.values(ReportTypes), // Sử dụng enum từ file enums
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, // Thời điểm báo cáo
    },
    congestionLevel: {
      type: String,
      enum: Object.values(CongestionLevels), // Sử dụng enum từ file enums
      default: null,
    },
    analysisStatus: {
      type: Boolean, // true nếu đã được phân tích, false nếu chưa
      default: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // Đảm bảo chỉ chấp nhận kiểu 'Point'
        required: true,
      },
      coordinates: {
        type: [Number], // Mảng chứa [longitude, latitude]
        required: true,
      },
    },
    roadSegment_ids: [
      {
        type: mongoose.Schema.Types.ObjectId, // Liên kết nhiều đoạn đường
        ref: "RoadSegment",
      },
    ],
    listImg: [imageUserReportSchema],
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
    versionKey: false,
  }
);

userReportSchema.index({ location: "2dsphere" });

export default mongoose.model("AccountReport", userReportSchema);