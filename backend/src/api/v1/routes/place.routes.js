import { Router } from "express";
import {
  nearestValidator,
  addPlaceValidator,
  updatePlaceValidator,
  findPlaceNameValidator,
  updateStatusValidator,
} from "../validations/place.validator.js";
import { handleValidationErrors } from "../validations/result.validator.js";
import {
  searchNearest,
  createPlace,
  updatePlace,
  deletePlace,
  findPlaceById,
  findPlaceName,
  updateStatusPlace,
} from "../controller/place.controller.js";
import { veriFyToken, isAdmin } from "../middlewares/authJwt.js";
import {
  validateById,
  validateWithToken,
} from "../validations/commonField.validator.js";
import {handleSingleUpload} from "../middlewares/upload.js";
import {validateUploadSingleFile} from "../validations/uploadImage.validator.js";

const router = Router();

// Middleware kết hợp
const verifyTokenAndAdmin = [veriFyToken, isAdmin];

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "X-access-token, Origin, Content-type, Accept"
  );
  next();
});
// OK test done Và chỉ có quyền thêm sửa xóa nếu admin 
//  Có thể cập nhật database sau để cho người dùng có thể thêm sửa place của chính mình như chắc phải để version sau  đón chờ ở api/v2
// Route với middleware và controller
// ? Test ok
router.get("/nearest", [nearestValidator, handleValidationErrors], searchNearest);
// ? Test ok
router.get("/search", [findPlaceNameValidator, handleValidationErrors], findPlaceName);
// ? Test ok
router.get("/:id", [validateById, handleValidationErrors], findPlaceById);

router.post("/",[handleSingleUpload, validateUploadSingleFile], [validateWithToken, addPlaceValidator, handleValidationErrors, ...verifyTokenAndAdmin], createPlace);
// Test cái này trước 
// Ok
// Thiếu upload ảnh để cập nhật  
router.put("/:id",[handleSingleUpload], [validateById, validateWithToken, updatePlaceValidator, handleValidationErrors, ...verifyTokenAndAdmin], updatePlace);
// Bỏ các api dưới này đi 
router.patch("/:id", [validateById, updateStatusValidator, handleValidationErrors, ...verifyTokenAndAdmin], updateStatusPlace);
// ? OK

router.delete("/:id", [validateById, validateWithToken, handleValidationErrors, ...verifyTokenAndAdmin], deletePlace);

export default router;
