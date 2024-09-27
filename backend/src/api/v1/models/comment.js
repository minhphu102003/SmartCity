import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        star :{
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        content :{
            type: String,
            require: true,
        },
        user_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        place_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Place",
        },
        image:{
            type:String,
            unique: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

export default mongoose.model("Comment",commentSchema);