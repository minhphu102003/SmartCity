import mongoose from "mongoose";

// Định nghĩa schema cho RoadSegment
const roadSegmentSchema = new mongoose.Schema(
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
    congestionLevel: {
      type: String,
      enum: ["NO_CONGESTION", "POSSIBLE_CONGESTION", "HEAVY_CONGESTION"], // Mức độ kẹt xe
      required: true,
    },
    trafficVolume: {
      type: Number, // Lưu trữ lưu lượng giao thông
      default: 0, // Giá trị mặc định là 0
    },
    weatherImpact: {
      type: Boolean, // Ảnh hưởng của thời tiết
      default: false, // Mặc định là không có ảnh hưởng
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
    versionKey: false,
  }
);

export default mongoose.model("RoadSegment", roadSegmentSchema);
