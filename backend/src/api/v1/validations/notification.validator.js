import { body } from "express-validator";
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
];
