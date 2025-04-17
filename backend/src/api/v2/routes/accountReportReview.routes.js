import { Router } from "express";
import { isAdmin, veriFyToken } from "../../shared/middlewares/authJWT.js";
import {
  validateWithToken,
  validateById,
} from "../../shared/validation/commonField.validator.js";
import { handleValidationErrors } from "../../shared/validation/result.validator.js";
import {
  createAccountReportReviewValidator,
  getAccountReportReviewsValidator,
  updateAccountReportReviewValidator
} from "../validations/accountReportReview.validator.js";
import {
  createAccountReportReviewController,
  getAccountReportReviewsController,
  deleteAccountReportReviewController,
  getAccountReportReviewByIdController,
  updateAccountReportReviewController,
} from "../controllers/accountReportReview.controller.js";

const router = Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get(
  "/",
  validateWithToken,
  getAccountReportReviewsValidator,
  handleValidationErrors,
  veriFyToken,
  isAdmin,
  getAccountReportReviewsController
);

router.get(
  "/:id",
  validateWithToken,
  validateById,
  handleValidationErrors,
  veriFyToken,
  isAdmin,
  getAccountReportReviewByIdController
);

router.post(
  "/",
  validateWithToken,
  createAccountReportReviewValidator,
  handleValidationErrors,
  veriFyToken,
  createAccountReportReviewController
);

router.put(
  "/:id",
  validateWithToken,
  validateById,
  updateAccountReportReviewValidator,
  handleValidationErrors,
  veriFyToken,
  isAdmin,
  updateAccountReportReviewController
);

router.delete(
  "/:id",
  validateWithToken,
  validateById,
  handleValidationErrors,
  veriFyToken,
  isAdmin,
  deleteAccountReportReviewController
);

export default router;
