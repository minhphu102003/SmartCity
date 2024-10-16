import mongoose from "mongoose";

// Định nghĩa schema cho Route
const routeSchema = new mongoose.Schema(
  {
    start_longitude: {
      type: Number, // Kinh độ điểm bắt đầu
      required: true,
    },
    start_latitude: {
      type: Number, // Vĩ độ điểm bắt đầu
      required: true,
    },
    end_longitude: {
      type: Number, // Kinh độ điểm kết thúc
      required: true,
    },
    end_latitude: {
      type: Number, // Vĩ độ điểm kết thúc
      required: true,
    },
    segments: [
      {
        type: mongoose.Schema.Types.ObjectId, // Tham chiếu tới RoadSegment
        ref: "RoadSegment", // Tên model được tham chiếu
      },
    ], // Mảng chứa các đoạn đường trên tuyến
    total_distance: {
      type: Number, // Tổng khoảng cách của tuyến đường
      required: true,
    },
    total_duration: {
      type: Number, // Tổng thời gian của tuyến đường (có thể là giây hoặc phút)
      required: true,
    },
    recommended: {
      type: Boolean, // Tuyến đường được đề xuất hay không
      default: false, // Mặc định là không được đề xuất
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
    versionKey: false,
  }
);

export default mongoose.model("Route", routeSchema);
