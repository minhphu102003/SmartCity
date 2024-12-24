import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
    },
    longitude:{
      type: Number
    },
    latitude:{
      type: Number
    },
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    uniqueId: { type: String},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("User", userSchema);
