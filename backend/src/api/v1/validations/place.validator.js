import { body, query } from "express-validator";
import Place from  "../models/place.js";
import {PlaceTypes} from "../constants/enum.js";

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
        .withMessage("Longitude must be a number between -180 and 180"),
    query('limit')
        .optional() // Tham số này không bắt buộc
        .isInt({ min: 1 }).withMessage('Limit must be a positive integer') // Kiểm tra phải là số nguyên dương
        .toInt(),
    query('radius')
        .optional() // Tham số này không bắt buộc
        .isInt({ min: 1 }).withMessage('Radius must be a positive integer') // Kiểm tra phải là số nguyên dương
        .toInt(),
    query("type")
        .optional()
        .isIn(Object.values(PlaceTypes))
        .withMessage(
            `Type of report must be one of: ${Object.values(PlaceTypes).join(", ")}`
        ),
    query('page')
        .optional() // This parameter is optional
        .isInt({ min: 1 }).withMessage('Page number must be a positive integer') // Check positive integer
        .toInt(), // Convert to integer
];

export const findPlaceNameValidator = [
    query('name')
    .trim() // Remove excess whitespace
    .notEmpty().withMessage('Place name cannot be empty') // Check not empty
    .bail()
        .isString().withMessage('Place name must be a string'), // Check data type

    query('limit')
        .optional() // This parameter is optional
        .isInt({ min: 1 }).withMessage('Limit must be a positive integer') // Check positive integer
        .toInt(), // Convert to integer

    query('page')
        .optional() // This parameter is optional
        .isInt({ min: 1 }).withMessage('Page number must be a positive integer') // Check positive integer
        .toInt(), // Convert to integer
];

export const updateStatusValidator = [
    body('status')
        .exists().withMessage('Status is required') // Check if it exists
        .isBoolean().withMessage('Status must be true or false'), // Check Boolean data type
];

// ! Validator ở đây còn thiếu 
export const addPlaceValidator = [
    body("type")
        .optional()
        .isIn(Object.values(PlaceTypes))
        .withMessage(`Type of report must be one of: ${Object.values(PlaceTypes).join(", ")}`),

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

    // Custom validator to check unique coordinate pairs after both latitude and longitude are present
    body()
        .custom(async (reqBody) => {
            const { longitude, latitude } = reqBody;
            if (longitude && latitude) {
                const existingPlace = await Place.findOne({ "location.coordinates": [longitude, latitude] });
                if (existingPlace) {
                    throw new Error("A place with these coordinates already exists");
                }
            }
        }),
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
        .withMessage("Time Close must be in HH:mm format"),
];

export const updatePlaceValidator = [
    body("type")
        .optional()
        .isIn(Object.values(PlaceTypes))
        .withMessage(`Type of report must be one of: ${Object.values(PlaceTypes).join(", ")}`),

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

    // Custom validator to ensure both longitude and latitude are provided together
    body()
        .custom((reqBody) => {
            const { longitude, latitude } = reqBody;
            if ((longitude && !latitude) || (!longitude && latitude)) {
                throw new Error("Both longitude and latitude must be provided together");
            }
            return true; // If both are present or neither is present, validation passes
        }),

    // Custom validator to check unique coordinate pairs only if both latitude and longitude are present
    body()
        .custom(async (reqBody, { req }) => {
            const { longitude, latitude } = reqBody;
            const placeId = req.params.id; // Use `id` from route parameters
            if (longitude && latitude) {
                const existingPlace = await Place.findOne({
                    "location.coordinates": [longitude, latitude],
                    _id: { $ne: placeId }, // Exclude the current place being updated
                });
                if (existingPlace) {
                    throw new Error("A place with these coordinates already exists");
                }
            }
        }),
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
        .withMessage("Time Close must be in HH:mm format"),
];

