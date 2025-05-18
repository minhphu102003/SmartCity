import { Router } from "express";
import {
  validateById,
} from "../validations/commonField.validator.js";
import { paginationValidator } from "../../shared/validation/pagination.validator.js";
import { handleValidationErrors } from "../validations/result.validator.js";
import {
  getCameraReports,
  getCameraReportById,
} from "../controller/cameraReport.controller.js";

const router = Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/", paginationValidator, handleValidationErrors, getCameraReports);

router.get("/:id", [validateById], handleValidationErrors, getCameraReportById);


export default router;

