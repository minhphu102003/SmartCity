import mongoose from "mongoose";

// Định nghĩa schema cho weatherCondition
const weatherConditionSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true, // Tự động sinh ID
  },
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
});

// Định nghĩa schema cho weather
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
  sunrise: {
    type: Number, // Thời gian mặt trời mọc (UNIX timestamp)
    required: true,
  },
  sunset: {
    type: Number, // Thời gian mặt trời lặn (UNIX timestamp)
    required: true,
  },
  timezone: {
    type: Number, // Múi giờ
    required: true,
  },
  weather_conditions: [
    {
      type: mongoose.Schema.Types.ObjectId, // Tham chiếu tới weatherCondition
      ref: "WeatherCondition",
    },
  ], // Mảng chứa các điều kiện thời tiết
}, {
  timestamps: true, // Tự động tạo createdAt và updatedAt
  versionKey: false,
});

// Tạo model cho WeatherCondition
const WeatherCondition = mongoose.model('WeatherCondition', weatherConditionSchema);

// Tạo model cho Weather
const Weather = mongoose.model('Weather', weatherSchema);

export { Weather, WeatherCondition };
