import { body } from "express-validator";
import Account from "../models/account.js";
import User from "../models/user.js";

// Validator chung cho email
const emailValidator = () =>
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email CANNOT be empty")
    .bail()
    .isEmail()
    .withMessage("Email is Invalid");

// Validator chung cho password
const passwordValidator = (fieldName) => {
  return body(fieldName)
    .trim()
    .notEmpty()
    .withMessage("Password CANNOT be empty")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password MUST be at least 8 characters long")
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .withMessage("Password MUST include one uppercase letter, one lowercase letter, one number, and one special character");
};

// Validator chung cho OTP
const otpValidator = () =>
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP CANNOT be empty")
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 characters");

// Validator kiểm tra tên người dùng và kiểm tra tính duy nhất của username
const usernameValidator = () =>
  body("username")
    .trim()
    .notEmpty()
    .withMessage("User name CANNOT be empty")
    .bail()
    .custom(async (username) => {
      const userNameExist = await Account.findOne({ username });
      if (userNameExist) {
        throw new Error("User Name already in use");
      }
    });

// Validator kiểm tra tính duy nhất của email
const uniqueEmailValidator = () =>
  emailValidator().bail().custom(async (email) => {
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      throw new Error("Email already in use");
    }
  });

// Cấu hình các validator cụ thể cho từng API
export const signInValidator = [
  emailValidator(),
  passwordValidator("password"), // Sửa chỗ này
];

export const signUpValidator = [
  usernameValidator(),
  uniqueEmailValidator(),
  passwordValidator("password"),
];

export const forgotPasswordValidator = [emailValidator()];

export const resetPasswordValidator = [
  emailValidator(),
  passwordValidator("newPassword"), // Sửa chỗ này
];

export const changePasswordValidator = [
  passwordValidator("currentPassword"), // Sửa chỗ này
  passwordValidator("newPassword"), // Sửa chỗ này
];

export const verifyValidator = [emailValidator(), otpValidator()];
