import mongoose from "mongoose";

import { ROLES } from '~/shared/constants';

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
