import { Router } from "express";
// import {handleMultipleUploads} from "../middlewares/upload.js";
import {handleMultipleUploads} from "../services/cloudinary.service.js";
import {
  veriFyToken,
  isAdmin,
  isAdminOrOwner,
} from "../middlewares/authJwt.js";
import {
  validateById,
  validateWithToken,
} from "../validations/commonField.validator.js";
import {
  createAccountReportValidator,
  getAccountReportValidator,
  updateAccountReportValidator,
} from "../validations/accountReport.validator.js";
import { handleValidationErrors } from "../validations/result.validator.js";
import {
  createAccountReport,
  getAccountReports,
  getAccountReportById,
  updateAccountReport,
  deleteAccountReport,
} from "../controller/accountReport.controller.js";

const router = Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/", [getAccountReportValidator, handleValidationErrors], getAccountReports);
router.get("/:id", [validateById, handleValidationErrors], getAccountReportById);
router.post("/", handleMultipleUploads, [validateWithToken, createAccountReportValidator, handleValidationErrors], veriFyToken, createAccountReport); // ? Đã test
router.put("/:id",[handleMultipleUploads], [validateById, validateWithToken, updateAccountReportValidator, handleValidationErrors], veriFyToken, isAdminOrOwner, updateAccountReport); // Test cả 2 role done, Xóa thành công ảnh trên server
router.delete("/:id", [validateById, validateWithToken, handleValidationErrors], [veriFyToken, isAdmin], deleteAccountReport);

export default router;

