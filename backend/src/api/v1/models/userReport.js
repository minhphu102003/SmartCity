import mongoose from "mongoose";

const userReportSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,  
        },
        description: {
            type: String, 
            default: null,
        },
        typeReport: {
            type: Boolean, 
            required: true,
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

export default mongoose.model("UserReport", userReportSchema);