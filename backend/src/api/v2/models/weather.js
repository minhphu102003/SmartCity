import mongoose from "mongoose";
import { Weather, WeatherCondition } from "../../shared/models/index.js";

const weatherV2Schema = new mongoose.Schema(Weather.schema.obj);
weatherV2Schema.add({
  rainfall_mm: { type: Number, default: null },
  rainfall_duration: { type: Number, default: null },
});

const WeatherV2 = mongoose.model("WeatherV2", weatherV2Schema);

export { WeatherV2, WeatherCondition };
