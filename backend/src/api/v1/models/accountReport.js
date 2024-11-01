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
    longitude: {
      type: Number, // Kinh độ tại thời điểm report
      default: null,
    },
    latitude: {
      type: Number, // Vĩ độ tại thời điểm report
      default: null,
    },
    roadSegment_id: {
      type: mongoose.Schema.Types.ObjectId, // Sử dụng ObjectId để tham chiếu đến model RoadSegment
      ref: "RoadSegment", // Tham chiếu đến mô hình RoadSegment
      // Bỏ 'required: true' để làm cho foreign key này là optional
    },
    listImg: [imageUserReportSchema],
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
    versionKey: false,
  }
);

export default mongoose.model("AccountReport", userReportSchema);