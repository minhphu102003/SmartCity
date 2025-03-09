import mongoose from "mongoose";

import { ROLES } from '../constants/index.js';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("Role", roleSchema);
