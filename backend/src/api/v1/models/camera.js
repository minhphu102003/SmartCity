import mongoose from "mongoose";

const cameraSchema = new mongoose.Schema(
    {
        // Để MongoDB tự động sinh ra _id
        longitude: {
            type: Number,
            required: true,
        },
        latitude: {
            type: Number,
            required: true,
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
            required: true, // Bắt buộc phải có roadSegment_id
        },
    },
    {
        timestamps: true, // Tự động thêm trường createdAt và updatedAt
        versionKey: false,
    }
);

export default mongoose.model("Camera", cameraSchema);
