import mongoose from "mongoose";
import { ReportTypes } from '../constants/enum.js'; 

const cameraReportSchema = new mongoose.Schema(
    {
        camera_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Camera",
            required: true,  
        },
        floodTraffic: {
            type: Number,  
            required: true,
        },
        typeReport: {
            type: String,
            enum: Object.values(ReportTypes),
            required: true,
        },
        image: {
            type: String,  
            required: true,
            unique: true,
        },
        timestamp: {
            type: Date,  
            default: Date.now, 
        }
    },
    {
        timestamps: true,  
        versionKey: false,
    }
);

export default mongoose.model("CameraReport", cameraReportSchema);
