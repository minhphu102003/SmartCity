import mongoose from "mongoose";

const weatherConditionSchema = new mongoose.Schema({
  main: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
}, {
  versionKey: false,
});


const weatherSchema = new mongoose.Schema({
  dt: {
    type: Number, 
    required: true,
  },
  temp: {
    type: Number, 
    required: true,
  },
  feels_like: {
    type: Number,
    required: true,
  },
  temp_min: {
    type: Number,
    required: true,
  },
  temp_max: {
    type: Number, 
    required: true,
  },
  pressure: {
    type: Number, 
    required: true,
  },
  humidity: {
    type: Number, 
    required: true,
  },
  visibility: {
    type: Number, 
    required: true,
  },
  wind_speed: {
    type: Number, 
    required: true,
  },
  wind_deg: {
    type: Number,
    required: true,
  },
  clouds_all: {
    type: Number, 
    required: true,
  },
  country: {
    type: String, 
    required: true,
  },
  timezone: {
    type: Number, 
    required: true,
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
      validate: {
        validator: function (val) {
          return val.length === 2;
        },
        message: 'Coordinates should be an array of [longitude, latitude]',
      },
    },
  },
  weather_conditions: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "WeatherCondition",
    },
  ], 
}, {
  timestamps: true, 
  versionKey: false,
});

weatherSchema.index({ location: "2dsphere" });

const WeatherCondition = mongoose.model('WeatherCondition', weatherConditionSchema);

const Weather = mongoose.model('Weather', weatherSchema);

export { Weather, WeatherCondition };