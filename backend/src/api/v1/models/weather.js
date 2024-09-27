import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema(
    {
        longitude: {
            type : Number,
            require: true,
            min: -180,
            max: 180,
        },
        latitude: {
            type: Number,
            require: true,
            min: -180,
            max: 180,
        },
        tempertature:{
            type: Number,
            require : true,
        },
        humidity:{
            type: Number,
            require: true,
        },
        wind_speed: {
            type: Number,
            require: true,
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

export default mongoose.model("Weather",weatherSchema);