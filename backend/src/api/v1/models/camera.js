import mongoose from "mongoose";

const cameraSchema = new mongoose.Schema(
  {
    location: {
      type: {
        type: String,
        enum: ["Point"], // Only accept 'Point'
        required: true,
      },
      coordinates: {
        type: [Number], // Array of [longitude, latitude]
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
      default: Date.now, // Default installation date is the current time
    },
    roadSegments: [{
      type: mongoose.Schema.Types.ObjectId, // Reference to multiple RoadSegment models
      ref: "RoadSegment", // Reference to the RoadSegment model
    }],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    versionKey: false,
  }
);

cameraSchema.index({ location: "2dsphere" }); // Create a 2dsphere index for geospatial queries

export default mongoose.model("Camera", cameraSchema);
