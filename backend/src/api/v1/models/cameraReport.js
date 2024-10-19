import mongoose from "mongoose";
import { CongestionLevels, ReportTypes } from "../constants/enum.js";

const cameraReportSchema = new mongoose.Schema(
    {
        camera_id: {
            type: mongoose.Schema.Types.ObjectId, // Tham chiếu đến Camera model
            ref: "Camera",
            required: true,
        },
        trafficVolume: {
            type: Number, // Số lượng phương tiện qua lại trên 1 phút
            required: true,
        },
        congestionLevel: {
            type: String,
            enum: Object.values(CongestionLevels), // Mức độ kẹt xe: "NO_CONGESTION", "POSSIBLE_CONGESTION", "HEAVY_CONGESTION"
            required: true,
        },
        typeReport: {
            type: String,
            enum: Object.values(ReportTypes), // Loại báo cáo: "TRAFFIC_JAM", "FLOOD"
            required: true,
        },
        img: {
            type: String, // Đường dẫn đến hình ảnh chụp được
            required: true,
        },
        timestamp: {
            type: Date, // Thời gian báo cáo
            default: Date.now, // Mặc định là thời gian hiện tại
        },
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
        versionKey: false,
    }
);

export default mongoose.model("CameraReport", cameraReportSchema);
