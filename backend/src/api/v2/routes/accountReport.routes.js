import { Router } from "express";

import { veriFyToken } from '../../shared/middlewares/authJWT.js';
import { validateWithToken } from '../../shared/validation/commonField.validator.js';
import { handleValidationErrors } from '../../shared/validation/result.validator.js';
import { handleVideoUploadWithMaxSizeOnly } from "../middlewares/uploadMiddleware.js";
import { createAccountReportValidator } from "../validations/accountReport.validartor.js";
import { createAccountReportV2Controller } from '../controllers/accountReport.controller.js';

const router = Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});


router.post("/", handleVideoUploadWithMaxSizeOnly, [validateWithToken, createAccountReportValidator, handleValidationErrors], veriFyToken, createAccountReportV2Controller);


export default router;

