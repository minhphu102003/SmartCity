import mongoose from "mongoose";

const cameraSchema = new mongoose.Schema(
  {
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
    link :{
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      default: true,
    },
    installation_date: {
      type: Date,
      default: Date.now,
    },
    roadSegments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoadSegment", 
    }],
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

cameraSchema.index({ location: "2dsphere" });

export default mongoose.model("Camera", cameraSchema);
