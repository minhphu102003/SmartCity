import mongoose from "mongoose";
import {PlaceTypes} from "../constants/enum.js";

const placeSchema = new mongoose.Schema(
  {
    // ! Enum cho kiểu dữ liệu này 
    type: {
      type: String,
      enum: Object.values(PlaceTypes), // Chỉ chấp nhận các giá trị từ PlaceTypes
      required: true,
    },
    name: {
      type: String,
      required: true, // Bắt buộc nhập
      trim: true, // Loại bỏ khoảng trắng thừa ở đầu và cuối
    },
    star: {
      type: Number,
      min: 0, // Điểm số tối thiểu
      max: 5, // Điểm số tối đa
      default: 0, // Giá trị mặc định
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // Đảm bảo chỉ chấp nhận kiểu 'Point'
        required: true,
      },
      coordinates: {
        type: [Number], // Mảng chứa [longitude, latitude]
        required: true,
        validate: {
          validator: function (v) {
            return v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90;
          },
          message: "Coordinates must be an array of [longitude, latitude] within valid ranges",
        },
      },
    },
    img: {
      type: String,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true, // Giá trị mặc định
    },
    timeOpen: {
      type: String,
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // Validate HH:mm format
        },
        message: props => `${props.value} is not a valid time format!`,
      }, // Có thể dùng String hoặc một định dạng thời gian khác
    },
    timeClose: {
      type: String,
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // Validate HH:mm format
        },
        message: props => `${props.value} is not a valid time format!`,
      }, // Có thể dùng String hoặc một định dạng thời gian khác
    },
  },
  {
    timestamps: true, // Thêm các trường createdAt và updatedAt
    versionKey: false, // Vô hiệu hóa phiên bản __v
    collection: 'place',
  }
);

export default mongoose.model("Place", placeSchema); // Xuất model Place
