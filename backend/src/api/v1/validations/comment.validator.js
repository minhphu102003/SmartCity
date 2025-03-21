import { body } from "express-validator";

export const validateCreateComment = [
  body("star")
    .trim()
    .notEmpty()
    .withMessage("Star is not empty!")
    .isInt({ min: 1, max: 5 }) // Giả sử đánh giá từ 1 đến 5
    .withMessage("Star must be an integer between 1 and 5."),
  body("place_id")
    .trim()
    .notEmpty()
    .withMessage("Place ID is not empty!")
    .bail()
    .isMongoId()
    .withMessage("Place ID must be a valid MongoDB ID."),
];

export const validateUpdateComment = [
  body("star")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Star must be an integer between 1 and 5."),
  body("content")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Content cannot be empty."),
];
