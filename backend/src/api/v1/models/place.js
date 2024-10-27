import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    // ! Enum cho kiểu dữ liệu này 
    type: {
      type: Number,
      required: true, // Bắt buộc nhập
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
    longitude: {
      type: Number,
      required: true, // Bắt buộc nhập
      min: -180, // Kinh độ tối thiểu
      max: 180, // Kinh độ tối đa
    },
    latitude: {
      type: Number,
      required: true, // Bắt buộc nhập
      min: -90, // Vĩ độ tối thiểu
      max: 90, // Vĩ độ tối đa
    },
    img: {
      type: String,
      unique: true, // Đảm bảo ảnh là duy nhất
      required: true, // Bắt buộc nhập
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
