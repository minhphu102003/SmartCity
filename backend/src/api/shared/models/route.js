import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    start_location: {
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
    end_location: {
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
    segments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RoadSegment",
      },
    ], 
    total_distance: {
      type: Number,
      required: true,
    },
    recommended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

routeSchema.index({ start_location: "2dsphere" });
routeSchema.index({ end_location: "2dsphere" });

export default mongoose.model("Route", routeSchema);
