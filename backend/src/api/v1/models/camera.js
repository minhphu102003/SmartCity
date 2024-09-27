import mongoose from "mongoose";

const cameraSchema = new mongoose.Schema(
    {
        longitude: {
            type : Number,
            require: true,
        },
        latitude:{
            type : Number,
            require: true,
        },
        status: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    },
)

export default mongoose.model("Camera",cameraSchema);