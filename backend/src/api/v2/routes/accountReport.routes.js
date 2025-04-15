import { Router } from "express";

import { veriFyToken } from '../../shared/middlewares/authJWT.js';
import { validateWithToken } from '../../shared/validation/commonField.validator.js';
import { handleValidationErrors } from '../../shared/validation/result.validator.js';
import { handleVideoUploadWithMaxSizeOnly, handleVideoUploadToS3 } from "../middlewares/uploadMiddleware.js";
import { createAccountReportValidator } from "../validations/accountReport.validartor.js";
import { createAccountReportV2Controller , getAccountReportsController, getAccountReportByIdController} from '../controllers/accountReport.controller.js';
import { getAccountReportValidator } from "../validations/accountReport.validartor.js";
import { validateById } from "../../shared/validation/commonField.validator.js";

const router = Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/", [getAccountReportValidator, handleValidationErrors], getAccountReportsController);
router.get("/:id", [validateById, handleValidationErrors], getAccountReportByIdController);
router.post("/", handleVideoUploadToS3, [validateWithToken, createAccountReportValidator, handleValidationErrors], veriFyToken, createAccountReportV2Controller);


export default router;

