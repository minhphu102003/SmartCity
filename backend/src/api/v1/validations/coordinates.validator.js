import { check } from "express-validator";

// Reusable validation for coordinates
const coordinatesValidator = [
    check('longitude')
        .exists().withMessage('Missing longitude')
        .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be a number between -180 and 180'),
    check('latitude')
        .exists().withMessage('Missing latitude')
        .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be a number between -90 and 90')
];

// Exported validators for query and body
export const coordinatesQueryValidator = [...coordinatesValidator];
export const coordinatesBodyValidator = [...coordinatesValidator];
