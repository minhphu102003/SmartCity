import { body, param } from "express-validator";
import User from "../models/user.js";

export const signInValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email CANNOT be empty")
    .bail()
    .isEmail()
    .withMessage("Email is Invalid"),
  body("password").trim().notEmpty().withMessage("Password CANNOT be empty"),
];

export const signUpValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("User name CANNOT empty")
    .bail()
    .custom(async (username) => {
      const userNameExist = await User.findOne({ username });
      if (userNameExist) {
        throw new Error("User Name already in use");
      }
    }),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email CANNOT be empty")
    .bail()
    .isEmail()
    .withMessage("Email is invalid")
    .bail()
    .custom(async (email) => {
      const emailExist = await User.findOne({ email });
      if (emailExist) {
        throw new Error("Email already in use");
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password CANNOT be empty")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password MUST be at least 8 character long")
    .bail()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/
    )
    .withMessage(
      "Password MUST include one uppercase letter, one lowercase letter, one number, and one special character"
    ),
];

export const forgotPasswordValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email CANNOT be empty")
    .bail()
    .isEmail()
    .withMessage("Email is invalid"),
];

export const resetPasswordValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email CANNOT be empty")
    .bail()
    .isEmail()
    .withMessage("Email is invalid"),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("Password CANNOT be empty")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password MUST be at least 8 character long")
    .bail()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/
    )
    .withMessage(
      "Password MUST include one uppercase letter, one lowercase letter, one number, and one special character"
    ),
];

export const verifyValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email CANNOT be empty")
    .bail()
    .isEmail()
    .withMessage("Email is invalid"),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP CANNOT be empty")
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 characters"),
];
