import mongoose from "mongoose";


// ! Chưa biết xử lý như thế nào về table này 
const searchHistorySchema = new mongoose.Schema(
    {
        account_id :{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Account",
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