import { query } from "express-validator";

// Validator for date range
export const validateDateRange = [
    query('startDate')
        .optional()
        .isISO8601().withMessage('Start date must be a valid ISO 8601 date string'),
    query('endDate')
        .optional()
        .isISO8601().withMessage('End date must be a valid ISO 8601 date string')
        .custom((value, { req }) => {
            if (req.query.startDate && new Date(value) < new Date(req.query.startDate)) {
                throw new Error('End date must be after start date');
            }
            return true;
        }),
];

// Validator for distance
export const validateDistance = [
    query('distance')
        .optional()
        .isInt({ min: 0 }).withMessage('Distance must be a positive integer')
        .toInt(), // Convert to integer
];