import mongoose from "mongoose";
import { CongestionLevels, ReportTypes } from "../constants/index.js";

const cameraReportSchema = new mongoose.Schema(
    {
        camera_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Camera",
            required: true,
        },
        trafficVolume: {
            type: Number,
            required: true,
        },
        congestionLevel: {
            type: String,
            enum: Object.values(CongestionLevels),
            required: true,
        },
        typeReport: {
            type: String,
            enum: Object.values(ReportTypes),
            required: true,
        },
        img: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now, 
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("CameraReport", cameraReportSchema);
