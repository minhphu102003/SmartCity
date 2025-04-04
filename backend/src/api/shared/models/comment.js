import mongoose from "mongoose";

const imageCommentSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

const commentSchema = new mongoose.Schema(
  {
    star: {
      type: Number,
      min: 0,
      max: 5,
      default: 5,
      required: true,
    },
    timestamps:{
      type: Date,
      default: Date.now()
    },
    content: {
      type: String,
    },
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    place_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
    },
    listImg: [imageCommentSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Comment", commentSchema);