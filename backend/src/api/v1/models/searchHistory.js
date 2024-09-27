import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
    {
        user_id :{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        search_query :{
            type: String,
            require: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

export default mongoose.model("SearchHistory",searchHistorySchema)