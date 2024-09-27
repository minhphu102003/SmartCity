import mongoose from "mongoose";

const trafficReportSchema = new mongoose.Schema(
    {
        camera_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Camera",
        },
        user_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User",
        },
        image: {
            type: String,
            require: true,
            unique: true,
        },
        description:{
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)


export default mongoose.model("TrafficReport",trafficReportSchema);