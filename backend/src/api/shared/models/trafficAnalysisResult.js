import mongoose from "mongoose";
import { CongestionLevels } from '../constants';

const trafficAnalysisResultSchema = new mongoose.Schema(
  {
    accountReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountReport",
      required: true,
    },
    congestionLevel: {
      type: String,
      enum: Object.values(CongestionLevels),
      default: null,
    },
    processedTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    additionalInfo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("TrafficAnalysisResult", trafficAnalysisResultSchema);
