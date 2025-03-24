import { check } from "express-validator";

const coordinatesValidator = [
    check('longitude')
        .exists().withMessage('Missing longitude')
        .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be a number between -180 and 180'),
    check('latitude')
        .exists().withMessage('Missing latitude')
        .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be a number between -90 and 90')
];

export const coordinatesQueryValidator = [...coordinatesValidator];
export const coordinatesBodyValidator = [...coordinatesValidator];
