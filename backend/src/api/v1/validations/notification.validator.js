import { body } from "express-validator";
import mongoose from "mongoose";
import { coordinatesBodyValidator } from './coordinates.validator.js';


export const notificationValidator = [

  body("message")
    .exists()
    .withMessage("Missing message")
    .isString()
    .withMessage("Message must be a string")
    .notEmpty()
    .withMessage("Message cannot be empty"),

    ...coordinatesBodyValidator,

  body("img")
    .exists()
    .withMessage("Missing img")
    .isString()
    .withMessage("Image URL must be a string")
    .notEmpty()
    .withMessage("Image URL cannot be empty"),
];
