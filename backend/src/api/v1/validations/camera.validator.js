import { body, query } from "express-validator";

export const getListCameraValidator = [
    query('limit')
        .optional()
        .isInt({ min: 1 }).withMessage('Limit must be a positive integer'), // Kiểm tra limit có hợp lệ không
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer') // Kiểm tra page có hợp lệ không
];


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
