import mongoose from "mongoose";
import { CongestionLevels, ReportTypes } from '../constants/index.js' ;

const imageUserReportSchema = new mongoose.Schema({
    img: {
      type: String,
      required: true,
    },
});

const userReportSchema = new mongoose.Schema(
  {
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    typeReport: {
      type: String,
      enum: Object.values(ReportTypes),
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, 
    },
    congestionLevel: {
      type: String,
      enum: Object.values(CongestionLevels), 
      default: null,
    },
    analysisStatus: {
      type: Boolean, 
      default: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    roadSegment_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RoadSegment",
      },
    ],
    listImg: [imageUserReportSchema],
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

userReportSchema.index({ location: "2dsphere" });

export default mongoose.model("AccountReport", userReportSchema);