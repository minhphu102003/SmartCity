import { body } from "express-validator";
import { MediaTypes } from "../constants/mediaType.js";
import { CongestionLevels } from "../../shared/constants/congestion.js";
import { ReportTypes } from "../../shared/constants/report.js";

export const createAccountReportValidator = [
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("typeReport")
    .isIn(Object.values(ReportTypes))
    .withMessage("Invalid report type"),

  body("congestionLevel")
    .optional()
    .isIn(Object.values(CongestionLevels))
    .withMessage("Invalid congestion level"),

  body("analysisStatus")
    .optional()
    .isBoolean()
    .withMessage("Analysis status must be a boolean"),

    body("longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180")
    .notEmpty()
    .withMessage("Longitude is required"),
  
    body("latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90")
    .notEmpty()
    .withMessage("Latitude is required"),

];
