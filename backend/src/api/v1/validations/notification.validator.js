import { body } from "express-validator";
import { coordinatesBodyValidator } from './coordinates.validator.js';


export const notificationValidator = [
  body("title")
  .exists()
  .withMessage("Missing message")
  .isString()
  .withMessage("Title must be a string")
  .notEmpty()
  .withMessage("Title cannot be empty"),

  body("message")
    .exists()
    .withMessage("Missing message")
    .isString()
    .withMessage("Message must be a string")
    .notEmpty()
    .withMessage("Message cannot be empty"),

    ...coordinatesBodyValidator,
];
