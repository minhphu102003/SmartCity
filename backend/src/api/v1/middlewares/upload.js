import multer from "multer";
import path from "path";
import { UPLOAD_DIRECTORY, MAX_FILE_SIZE, MAX_FILE_COUNT } from "../constants/uploadConstants.js";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,UPLOAD_DIRECTORY); // Đường dẫn lưu trữ ảnh, bạn có thể thay đổi
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE }, // Giới hạn 2MB mỗi ảnh
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg","image/jpg", "image/png", "image/gif"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only image files (JPEG, JPG, PNG, GIF) are allowed."));
    }
    cb(null, true);
  },
}).array("files", MAX_FILE_COUNT); 

export default (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    next();
  });
};