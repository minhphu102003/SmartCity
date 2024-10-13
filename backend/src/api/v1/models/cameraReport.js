import mongoose from "mongoose";

const cameraReportSchema = new mongoose.Schema(
    {
        camera_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Camera",
            required: true,  // Liên kết tới bảng Camera
        },
        floodTraffic: {
            type: Number,  // Biểu thị mức độ kẹt xe (hoặc lưu lượng xe)
            required: true,
        },
        typeReport: {
            type: Boolean,  // Phân loại báo cáo (ví dụ: true cho kẹt xe, false cho lưu thông bình thường)
            required: true,
        },
        image: {
            type: String,  // Đường dẫn đến hình ảnh
            required: true,
            unique: true,
        },
        timestamp: {
            type: Date,  // Thời điểm báo cáo được tạo ra
            default: Date.now,  // Tự động gán thời gian hiện tại khi tạo báo cáo
        }
    },
    {
        timestamps: true,  // Tạo tự động các trường createdAt và updatedAt
        versionKey: false,
    }
);

export default mongoose.model("CameraReport", cameraReportSchema);
