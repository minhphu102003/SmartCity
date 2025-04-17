import mongoose from "mongoose";
import { StatusReview } from "../constants/index.js";

const accountReportReviewSchema = new mongoose.Schema(
  {
    accountReport_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountReport",
      required: true,
    },
    reason: {
      type: String,
      required: true, 
    },
    status: {
      type: String,
      enum: Object.values(StatusReview),
      default: StatusReview.PENDING,
    },
    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    reviewed_at: {
      type: Date,
    },
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

export default mongoose.model("AccountReportReview", accountReportReviewSchema);
