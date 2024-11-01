import { body, query } from "express-validator";

export const getCameraValidator = [
  query("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a number between -90 and 90"), // Validate latitude

  query("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a number between -180 and 180"), // Validate longitude

  query("distance")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Distance must be a positive integer"), // Validate distance

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"), // Validate limit

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"), // Validate page
];

// ! Thiếu validate 2 camera cùng tọa độ

export const validateCreateCamera = [
  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a number between -90 and 90"), // Validate latitude
  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a number between -180 and 180"), // Validate longitude
  body("status")
    .optional()
    .isBoolean()
    .withMessage("Status must be a boolean value"),
  body("installation_date")
    .optional()
    .isISO8601()
    .withMessage("Installation date must be a valid date in ISO8601 format"),
  body("roadSegment_id")
    .optional()
    .isMongoId()
    .withMessage("Road Segment ID must be a valid MongoDB ObjectId"),
];

export const validateUpdateCamera = [
  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a number between -90 and 90"), // Validate latitude
  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a number between -180 and 180"), // Validate longitude
  body("status")
    .optional()
    .isBoolean()
    .withMessage("Status must be a boolean value"),
  body("installation_date")
    .optional()
    .isISO8601()
    .withMessage("Installation date must be a valid date in ISO8601 format"),
  body("roadSegment_id")
    .optional()
    .isMongoId()
    .withMessage("Road Segment ID must be a valid MongoDB ObjectId"),
];
