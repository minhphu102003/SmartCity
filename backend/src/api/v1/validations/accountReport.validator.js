import { body, query } from "express-validator";
import { CongestionLevels, ReportTypes } from "../constants/enum.js";

export const createAccountReportValidator = [
  body("description")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Description cannot exceed 100 characters"),
  
    body("typeReport")
    .isIn(Object.values(ReportTypes))
    .withMessage(
      `Type of report must be one of: ${Object.values(ReportTypes).join(", ")}`
    ),
  
    body("congestionLevel") // Correctly specify the field to validate
    .isIn(Object.values(CongestionLevels)) // Check against enum values
    .withMessage(
      `Congestion level must be one of: ${Object.values(CongestionLevels).join(", ")}`
    ),
  
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
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer."),
  
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be a positive integer not exceeding 100."),
  
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date format (ISO 8601)."),
  
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date format (ISO 8601)."),
  
  // Validate account_id
  query("account_id")
    .optional()
    .isMongoId()
    .withMessage("Account ID must be a valid MongoDB Object ID."),

  // Validate typeReport
  query("typeReport")
    .optional()
    .isIn(Object.values(ReportTypes))
    .withMessage(`Type of report must be one of: ${Object.values(ReportTypes).join(", ")}`),

  // Validate congestionLevel
  query("congestionLevel")
    .optional()
    .isIn(Object.values(CongestionLevels))
    .withMessage(`Congestion level must be one of: ${Object.values(CongestionLevels).join(", ")}`)
];


export const updateAccountReportValidator = [
  body("description")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Description cannot exceed 100 characters"),
  body("typeReport")
    .optional()
    .isIn(Object.values(ReportTypes))
    .withMessage(`Type of report must be one of: ${Object.values(ReportTypes).join(", ")}`),
  body("congestionLevel")
    .optional()
    .isIn(Object.values(CongestionLevels))
    .withMessage(`Congestion level must be one of: ${Object.values(CongestionLevels).join(", ")}`),
  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),
];