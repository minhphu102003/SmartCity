import { Router } from "express";
import { veriFyToken, isAdmin } from "../middlewares/authJwt.js";
import {
  getCameras,
  getCamerasByRoadSegment,
  getCameraById,
  createCamera,
  updateCamera,
  deleteCamera,
} from "../controller/camera.controller.js";
import {
  validateById,
  validateWithToken,
} from "../validations/commonField.validator.js";
import { handleValidationErrors } from "../validations/result.validator.js";
import {
  validateCreateCamera,
  validateUpdateCamera,
  getCameraValidator,
} from "../validations/camera.validator.js";

const router = Router();

const adminAuthMiddlewares = [
  validateWithToken,
  handleValidationErrors,
  veriFyToken,
  isAdmin,
];

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "X-access-token, Origin, Content-type, Accept"
  );
  next();
});

// Chưa test api cũng như chưa validate lại cho đúng  
// Lấy danh sách router từ admin
// ? Chưa test được roadsegment 
router.get("/road-segment/:id",[validateById, handleValidationErrors],getCamerasByRoadSegment);
// ? Ok test xong
router.get("/:id",[validateById, handleValidationErrors], getCameraById );
// ? OK test xong
router.get("/", [getCameraValidator, handleValidationErrors], getCameras);
// Tạo mới một camera từ admin
// ? test ok
router.post('/', [validateCreateCamera, ...adminAuthMiddlewares], createCamera);
// Cập nhật camera từ admin
// ? Test ok
router.put("/:id", [validateById, validateUpdateCamera, ...adminAuthMiddlewares], updateCamera);
// Xóa camera từ admin
// ? Test ok 
router.delete("/:id", [validateById, ...adminAuthMiddlewares], deleteCamera);

export default router;