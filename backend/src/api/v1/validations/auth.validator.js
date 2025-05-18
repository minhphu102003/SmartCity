import { body } from "express-validator";
import Account from "../models/account.js";
import User from "../models/user.js";

const emailValidator = () =>
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email CANNOT be empty")
    .bail()
    .isEmail()
    .withMessage("Email is Invalid");

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

const otpValidator = () =>
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP CANNOT be empty")
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 characters");

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

const uniqueEmailValidator = () =>
  emailValidator().bail().custom(async (email) => {
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      throw new Error("Email already in use");
    }
  });

export const signInValidator = [
  emailValidator(),
  passwordValidator("password"), 
];

export const signUpValidator = [
  usernameValidator(),
  uniqueEmailValidator(),
  passwordValidator("password"),
];

export const forgotPasswordValidator = [emailValidator()];

export const resetPasswordValidator = [
  emailValidator(),
  passwordValidator("newPassword"), 
];

export const changePasswordValidator = [
  passwordValidator("currentPassword"), 
  passwordValidator("newPassword"), 
];

export const verifyValidator = [emailValidator(), otpValidator()];
