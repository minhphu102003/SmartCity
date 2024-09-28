import { body, param, query, validationResult } from "express-validator";


export const nearestValidator = [
    query("latitude")
        .trim()
        .notEmpty()
        .withMessage("Latitude is not Empty")
        .bail()
        .isFloat({min: -90, max: 90})
        .withMessage("Latitude must be a number between -90 and 90"),
    query("longitude")
        .trim()
        .notEmpty()
        .withMessage("Longitude is not Empty")
        .bail()
        .isFloat({min:-180, max: 180})
        .withMessage("Longitude must be a number between -180 and 180")
];