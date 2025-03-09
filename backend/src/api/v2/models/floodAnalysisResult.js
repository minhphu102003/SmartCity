import mongoose from "mongoose";

const floodAnalysisResult = new mongoose.Schema(
    {
        accountReport_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true,
        },
        is_flooded: {
            type: Boolean,
            required: true,
        },
        flood_probability: {
            type: Number,
            required: true,
        },
        processedTime: {
            type: Datetime,
            required: true,
        },
        additional_info: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("FloodAnalysisResult", floodAnalysisResult);