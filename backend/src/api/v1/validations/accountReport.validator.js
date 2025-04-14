import { body, query } from "express-validator";
import { CongestionLevels, ReportTypes } from "../../shared/constants/index.js";
import { paginationValidator } from "../../shared/validation/pagination.validator.js"; 

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
  
    body("congestionLevel")
    .isIn(Object.values(CongestionLevels))
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
  ...paginationValidator,
  
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date format (ISO 8601)."),
  
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date format (ISO 8601)."),
  
  query("account_id")
    .optional()
    .isMongoId()
    .withMessage("Account ID must be a valid MongoDB Object ID."),

  query("typeReport")
    .optional()
    .isIn(Object.values(ReportTypes))
    .withMessage(`Type of report must be one of: ${Object.values(ReportTypes).join(", ")}`),

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