import mongoose from "mongoose";

const cameraSchema = new mongoose.Schema(
  {
    // Để MongoDB tự động sinh ra _id
    location: {
      type: {
        type: String,
        enum: ["Point"], // Only accept 'Point'
        required: true,
      },
      coordinates: {
        type: [Number], // Array of [longitude, latitude]
        required: true,
      },
    },
    status: {
      type: Boolean,
      default: true,
    },
    installation_date: {
      type: Date,
      default: Date.now, // Thời gian lắp đặt mặc định là thời điểm hiện tại
    },
    roadSegment_id: {
      type: mongoose.Schema.Types.ObjectId, // Sử dụng ObjectId để tham chiếu đến model RoadSegment
      ref: "RoadSegment", // Tham chiếu đến mô hình RoadSegment
      // Bỏ 'required: true' để làm cho foreign key này là optional
    },
  },
  {
    timestamps: true, // Tự động thêm trường createdAt và updatedAt
    versionKey: false,
  }
);

cameraSchema.index({ location: "2dsphere" }); // Create a 2dsphere index for geospatial queries

export default mongoose.model("Camera", cameraSchema);
