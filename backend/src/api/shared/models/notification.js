import mongoose from "mongoose";
import { NotificationStatus } from "../constants/index.js"; 

const notificationSchema = new mongoose.Schema(
    {
        account_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account", 
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String, 
            required: true, 
        },
        timestamp: {
            type: Date, 
            default: Date.now,
        },
        status: {
            type: String,
            enum: Object.values(NotificationStatus), 
            default: NotificationStatus.PENDING, 
        },
        longitude: {
            type: Number, 
            required: true, 
        },
        latitude: {
            type: Number,
            required: true, 
        },
        img: {
            type: String, 
        },
    },
    {
        timestamps: true, 
        versionKey: false,
    }
);

export default mongoose.model("Notification", notificationSchema);
