import mongoose from "mongoose";
import {PlaceTypes} from "../constants/index.js";

const placeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(PlaceTypes),
      required: true,
    },
    name: {
      type: String,
      required: true, 
      trim: true,
    },
    star: {
      type: Number,
      min: 0, 
      max: 5, 
      default: 5,
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
    img: {
      type: String,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true, 
    },
    timeOpen: {
      type: String,
    },
    timeClose: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false, 
    collection: 'place',
  }
);

placeSchema.index({ location: "2dsphere" });

export default mongoose.model("Place", placeSchema);
