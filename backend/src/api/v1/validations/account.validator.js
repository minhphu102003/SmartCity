import { body, query } from "express-validator";
import Account from "../models/account.js";
import User from "../models/user.js";

export const updateAccountValidator = [
  body("username")
    .optional()
    .isString()
    .withMessage("Username must be a string.")
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters.")
    .custom(async (username, { req }) => {
      const accountId = req.params.id; // ID của tài khoản đang cập nhật
      const account = await Account.findOne({ username, _id: { $ne: accountId } });
      if (account) {
        throw new Error("Username already exists.");
      }
      return true;
    }),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format.")
    .custom(async (email, { req }) => {
      const accountId = req.params.id; // ID của tài khoản đang cập nhật
      const user = await User.findOne({ email, account_id: { $ne: accountId } }); // Kiểm tra trong collection User
      if (user) {
        throw new Error("Email already exists.");
      }
      return true;
    }),

  body("phone")
    .optional()
    .isString() // Validate phone as a string
    .withMessage("Phone must be a string."),
];


export const searchAccountsValidator = [
  query("username")
    .optional()
    .isString()
    .withMessage("Username must be a string.")
    .isLength({ min: 1 })
    .withMessage("Username cannot be empty."),
  
  query("page")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Page must be a positive integer."),

  query("limit")
    .optional()
    .isInt({ gt: 0, lt: 101 }) // Optional limit, can be between 1 and 100
    .withMessage("Limit must be a positive integer and cannot exceed 100."),
];


export const validateManageAccountRoles = [
  body("add")
    .optional()
    .isBoolean()
    .withMessage("Add must be a boolean value."),
  
  body("remove")
    .optional()
    .isBoolean()
    .withMessage("Remove must be a boolean value."),

  body()
    .custom((value) => {
      // Check that at least one of add or remove is present
      if (!value.add && !value.remove) {
        throw new Error("Either 'add' or 'remove' must be present.");
      }
      return true; // If validation passes
    }),
]
