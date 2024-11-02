import { body, param, query } from "express-validator";

// Validator for account ID
export const accountIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid account ID format.")
    .trim(),
];

// Validator for updating account details
export const updateAccountValidator = [
  body("username")
    .optional()
    .isString()
    .withMessage("Username must be a string.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters."),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format."),
  body("roles")
    .optional()
    .isArray()
    .withMessage("Roles must be an array.")
    .custom((roles) => {
      if (!roles.every(role => typeof role === "string")) {
        throw new Error("Each role must be a string.");
      }
      return true;
    }),
  // Add more fields as necessary
];

// Validator for searching accounts
export const searchAccountsValidator = [
  query("username")
    .optional()
    .isString()
    .withMessage("Username must be a string.")
    .isLength({ min: 1 })
    .withMessage("Username cannot be empty."),
  // Add more query parameters if necessary
];

