import mongoose from "mongoose";

// Định nghĩa schema cho Route
const routeSchema = new mongoose.Schema(
  {
    start_location: {
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
    end_location: {
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

// Tạo index cho start_location và end_location để hỗ trợ truy vấn địa lý
routeSchema.index({ start_location: "2dsphere" });
routeSchema.index({ end_location: "2dsphere" });

export default mongoose.model("Route", routeSchema);
