import mongoose from "mongoose";

const imageUserReportSchema = new mongoose.Schema({
    img: {
      type: String,
      required: true, // Đường dẫn hoặc tên của ảnh
    },
});

const userReportSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      default: null, // Nếu người dùng có post mô tả
    },
    typeReport: {
        type: String,
        enum: ["TRAFFIC_JAM", "FLOOD"], 
        required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, // Thời điểm báo cáo
    },
    congestionLevel: {
      type: String,
      enum: ["NO_CONGESTION", "POSSIBLE_CONGESTION", "HEAVY_CONGESTION"],
      default: null, // Cấp độ tắc nghẽn giao thông sau khi phân tích
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
    listImg: [imageUserReportSchema],
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
    versionKey: false,
  }
);

export default mongoose.model("UserReport", userReportSchema);