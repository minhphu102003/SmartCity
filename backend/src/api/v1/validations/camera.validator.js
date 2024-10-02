import { body } from "express-validator";

export const validateCreateCamera = [
    body('longitude')
        .notEmpty()
        .withMessage('Longitude cannot be empty')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be a number between -180 and 180'),
    body('latitude')
        .notEmpty()
        .withMessage('Latitude cannot be empty')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be a number between -90 and 90'),
    body('status')
        .optional()
        .isBoolean()
        .withMessage('Status must be a boolean value'),
];

export const validateUpdateCamera = [
    body('longitude')
        .optional()
        .notEmpty()
        .withMessage('Longitude cannot be empty')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be a number between -180 and 180'),
    body('latitude')
        .optional()
        .notEmpty()
        .withMessage('Longitude cannot be empty')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be a number between -90 and 90'),
    body('status')
        .optional()
        .isBoolean()
        .withMessage('Status must be a boolean value'),
];
