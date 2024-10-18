import mongoose from "mongoose";
import { NotificationStatus } from "../constants/enum"; 

const notificationSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId, // Tham chiếu đến ID của người dùng
            ref: "User", // Tham chiếu đến mô hình User
            required: true, // Bắt buộc phải có user_id
        },
        message: {
            type: String, // Nội dung notification
            required: true, // Bắt buộc phải có message
        },
        timestamp: {
            type: Date, // Thời gian tạo notification
            default: Date.now, // Thời gian mặc định là hiện tại
        },
        status: {
            type: String,
            enum: Object.values(NotificationStatus), // Sử dụng enum từ NotificationStatus
            default: NotificationStatus.PENDING, // Giá trị mặc định là "PENDING"
        },
        longitude: {
            type: Number, // Kinh độ
            required: true, // Bắt buộc phải có longitude
        },
        latitude: {
            type: Number, // Vĩ độ
            required: true, // Bắt buộc phải có latitude
        },
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
        versionKey: false,
    }
);

export default mongoose.model("Notification", notificationSchema);