import mongoose from "mongoose";

const roadSegmentSchema = new mongoose.Schema(
    {
      roadName: {
        type: String,
      },
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
      roadSegmentLine: { 
        type: {
          type: String,
          enum: ["LineString"],
          required: true,
        },
        coordinates: {
          type: [[Number]], 
          required: true,
        },
      },
      reports: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CameraReport",
        },
      ],
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );
  
  roadSegmentSchema.index({ "start_location": "2dsphere" });
  roadSegmentSchema.index({ "end_location": "2dsphere" });
  
  export default mongoose.model("RoadSegment", roadSegmentSchema);