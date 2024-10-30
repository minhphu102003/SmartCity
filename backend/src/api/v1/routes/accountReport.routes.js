import { Router } from "express";
import uploadFileMiddleware from "../middlewares/upload.js";
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
  validateUploadFile,
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

const accountMiddleware = [handleValidationErrors];

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// ? Ok test xong
router.get(
  "/",
  [getAccountReportValidator, ...accountMiddleware],
  getAccountReports
);
// ? Ok Test xong
router.get("/:id", [validateById, ...accountMiddleware], getAccountReportById);
// ? Thiếu gửi lên kafka để python xử lý tiếp
router.post(
  "/",
  uploadFileMiddleware,
  validateUploadFile,
  [validateWithToken, createAccountReportValidator, ...accountMiddleware],
  veriFyToken,
  createAccountReport
);
// ? Đã test
router.put(
  "/:id",
  [
    validateById,
    validateWithToken,
    updateAccountReportValidator,
    ...accountMiddleware,
  ],
  veriFyToken,
  isAdmin,
  updateAccountReport
);

//  Test cả 2 role done

router.delete(
  "/:id",
  [validateById, validateWithToken, ...accountMiddleware],
  [veriFyToken, isAdminOrOwner],
  deleteAccountReport
);

export default router;
