import { query } from "express-validator";

// Validator for API findRoutesHandler
export const validateFindRoutes = [
  // Check for start parameter (longitude,latitude format)
  query("start")
    .notEmpty()
    .withMessage("Start coordinate is required")
    .matches(/^[-+]?((1[0-7]\d)|([1-9]?\d))(\.\d+)?,[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/)
    .withMessage("Start coordinate must be a valid longitude,latitude format"),

  // Check for end parameter (longitude,latitude format)
  query("end")
    .notEmpty()
    .withMessage("End coordinate is required")
    .matches(/^[-+]?((1[0-7]\d)|([1-9]?\d))(\.\d+)?,[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/)
    .withMessage("End coordinate must be a valid longitude,latitude format"),

  // Check for vehicleType parameter (optional, case-insensitive)
  query("vehicleType")
    .optional()
    .custom((value) => {
      const normalizedValue = value ? value.toLowerCase() : '';
      const validTypes = ["car", "bike", "foot", "drive"];
      if (!validTypes.includes(normalizedValue)) {
        throw new Error("Vehicle type must be one of 'car', 'bike', 'foot', or 'drive'");
      }
      return true;
    })
];
