import mongoose from "mongoose";

// Định nghĩa schema cho weatherCondition
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
  versionKey: false, // Tắt trường __v nếu không cần thiết
});


const weatherSchema = new mongoose.Schema({
  dt: {
    type: Number, // Thời gian (UNIX timestamp)
    required: true,
  },
  temp: {
    type: Number, // Nhiệt độ
    required: true,
  },
  feels_like: {
    type: Number, // Cảm giác nhiệt độ
    required: true,
  },
  temp_min: {
    type: Number, // Nhiệt độ tối thiểu
    required: true,
  },
  temp_max: {
    type: Number, // Nhiệt độ tối đa
    required: true,
  },
  pressure: {
    type: Number, // Áp suất
    required: true,
  },
  humidity: {
    type: Number, // Độ ẩm
    required: true,
  },
  visibility: {
    type: Number, // Tầm nhìn
    required: true,
  },
  wind_speed: {
    type: Number, // Tốc độ gió
    required: true,
  },
  wind_deg: {
    type: Number, // Hướng gió
    required: true,
  },
  clouds_all: {
    type: Number, // Độ bao phủ mây
    required: true,
  },
  country: {
    type: String, // Quốc gia
    required: true,
  },
  timezone: {
    type: Number, // Múi giờ
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"], // Only accept 'Point'
      required: true,
    },
    coordinates: {
      type: [Number], // Array of [longitude, latitude]
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
      type: mongoose.Schema.Types.ObjectId, // Reference to weatherCondition
      ref: "WeatherCondition",
    },
  ], // Array of weather conditions
}, {
  timestamps: true, // Automatically creates createdAt and updatedAt
  versionKey: false,
});

// Add a geospatial index to the location field
weatherSchema.index({ location: "2dsphere" });


// Tạo model cho WeatherCondition
const WeatherCondition = mongoose.model('WeatherCondition', weatherConditionSchema);

// Tạo model cho Weather
const Weather = mongoose.model('Weather', weatherSchema);

export { Weather, WeatherCondition };