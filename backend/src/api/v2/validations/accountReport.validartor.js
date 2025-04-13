import { body, query } from "express-validator";
import { MediaTypes } from "../constants/mediaType.js";
import { CongestionLevels } from "../../shared/constants/congestion.js";
import { ReportTypes } from "../../shared/constants/report.js";
import { paginationValidator } from "../../shared/validation/pagination.validator.js"; 

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

export const getAccountReportValidator = [
  ...paginationValidator,

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO8601 date."),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO8601 date."),

  query("account_id")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Account ID must be a valid MongoDB ObjectId."),

  query("typeReport")
    .optional()
    .isIn(Object.values(ReportTypes))
    .withMessage(`typeReport must be one of: ${Object.values(ReportTypes).join(", ")}`),

  query("congestionLevel")
    .optional()
    .isIn(Object.values(CongestionLevels))
    .withMessage(`congestionLevel must be one of: ${Object.values(CongestionLevels).join(", ")}`),

  query("analysisStatus")
    .optional()
    .isIn(["true", "false"])
    .withMessage("analysisStatus must be either 'true' or 'false'."),
];
