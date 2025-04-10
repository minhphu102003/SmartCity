import mongoose from "mongoose";
import { AccountReport } from "../../shared/models/index.js";
import { MediaTypes } from '../constants/index.js';

const mediaAccountReportSchema = new mongoose.Schema(
  {
    media_url: {
      type: String,
      required: true,
    },
    media_type: {
      type: String,
      enum: Object.values(MediaTypes),
      required: true,
    },
  },
  {
    timestamps: { createdAt: "uploaded_at", updatedAt: false },
    versionKey: false,
  }
);

const { listImg, ...accountReportSchemaObj } = AccountReport.schema.obj;

const userReportV2Schema = new mongoose.Schema(
  {
    ...accountReportSchemaObj,
    media_files:  mediaAccountReportSchema,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("AccountReportV2", userReportV2Schema);
