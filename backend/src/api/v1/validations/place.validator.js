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


export const addPlaceValidator = [
    body("type")
        .notEmpty()
        .withMessage("Type is required")
        .bail()
        .isInt()
        .withMessage("Type must be an integer"),
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),
    body("longitude")
        .notEmpty()
        .withMessage("Longitude is required")
        .bail()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be a number between -180 and 180"),
    body("latitude")
        .notEmpty()
        .withMessage("Latitude is required")
        .bail()
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be a number between -90 and 90"),
    body("img")
        .notEmpty()
        .withMessage("Image URL is required"),
    body("status")
        .optional()
        .isBoolean()
        .withMessage("Status must be a boolean value"),
    body("timeOpen")
        .optional()
        .trim(),
    body("timeClose")
        .optional()
        .trim(),
];

export const updatePlaceValidator = [
    body("type")
        .optional()
        .isInt()
        .withMessage("Type must be an integer"),
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty"),
    body("longitude")
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be a number between -180 and 180"),
    body("latitude")
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be a number between -90 and 90"),
    body("img")
        .optional()
        .notEmpty()
        .withMessage("Image URL cannot be empty"),
    body("status")
        .optional()
        .isBoolean()
        .withMessage("Status must be a boolean value"),
    body("timeOpen")
        .optional()
        .trim()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Time Open must be in HH:mm format"),
    body("timeClose")
        .optional()
        .trim()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Time Open must be in HH:mm format"),
];

