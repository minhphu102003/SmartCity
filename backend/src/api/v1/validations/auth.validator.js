import express from "express";
import {body, param, validationResult} from "express-validator";
import User from "../models/user";

export const signInValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email CANNOT be empty")
        .bail()
        .isEmail()
        .withMessage("Email is Invalid"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password CANNOT be empty")
];

export const signUpValidator = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("User name CANNOT empty"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email CANNOT be empty")
        .bail()
        .isEmail()
        .withMessage("Email is invalid")
        .bail()
        .custom( async(email) => {
            const emailExist = await User.findOne({email});
            if(emailExist){
                throw new Error("Email already in use");
            }
        }),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password CANNOT be empty")
            .bail()
            .isLength({min: 6})
            .withMessage("Password MUST be at least 6 character long")
            .bail()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage("Password MUST include one uppercase letter, one lowercase letter, and one number")
];  

export const forgotPasswordValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email CANNOT be empty")
        .bail()
        .isEmail()
        .withMessage("Email is invalid")
];

export const resetPasswordValidator = [
    param("resetToken")
        .notEmpty()
        .withMessage("Reset Token is missing"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password CANNOT be empty")
        .bail()
        .isLength({min: 6})
        .withMessage("Pasword MUST be at least 6 characters long")
        .bail()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Password MUST include one uppercase letter, one lowercase letter, and one number"),
    body("passwordConfirm").custom((value, {req})=>{
        if(value !== req.body.password){
            throw new Error("Password DO NOT match");
        }
        return true;
    }),
];