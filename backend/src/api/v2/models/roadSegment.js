import mongoose from "mongoose";
import { RoadSegment } from "../../shared/models/index.js";

const roadSegmentV2Schema = new mongoose.Schema(RoadSegment.schema.obj);
roadSegmentV2Schema.add({
  near_river: {
    type: Number,
    default: null,
  },
  groundwater_level: {
    type: Number,
    default: null,
  },
});

export default mongoose.model("RoadSegmentV2", roadSegmentV2Schema);
