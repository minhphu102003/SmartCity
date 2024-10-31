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
        .isInt({ min: 1 }).withMessage('Giới hạn phải là một số nguyên dương') // Kiểm tra phải là số nguyên dương
        .toInt(),
    query('radius')
        .optional() // Tham số này không bắt buộc
        .isInt({ min: 1 }).withMessage('Giới hạn phải là một số nguyên dương') // Kiểm tra phải là số nguyên dương
        .toInt(),
    query("type")
        .optional()
        .isIn(Object.values(PlaceTypes))
        .withMessage(
            `Type of report must be one of: ${Object.values(PlaceTypes).join(", ")}`
        ),
];

export const findPlaceNameValidator = [
    query('name')
        .exists().withMessage('Tên địa điểm là bắt buộc') // Kiểm tra xem có tồn tại không
        .isString().withMessage('Tên địa điểm phải là chuỗi') // Kiểm tra kiểu dữ liệu
        .trim() // Loại bỏ khoảng trắng thừa
        .notEmpty().withMessage('Tên địa điểm không được để trống'), // Kiểm tra không rỗng

    query('limit')
        .optional() // Tham số này không bắt buộc
        .isInt({ min: 1 }).withMessage('Giới hạn phải là một số nguyên dương') // Kiểm tra phải là số nguyên dương
        .toInt(), // Chuyển đổi sang số nguyên

    query('page')
        .optional() // Tham số này không bắt buộc
        .isInt({ min: 1 }).withMessage('Số trang phải là một số nguyên dương') // Kiểm tra phải là số nguyên dương
        .toInt(), // Chuyển đổi sang số nguyên
];

export const updateStatusValidator = [
    body('status')
        .exists().withMessage('Trạng thái là bắt buộc') // Kiểm tra xem có tồn tại không
        .isBoolean().withMessage('Trạng thái phải là true hoặc false'), // Kiểm tra kiểu dữ liệu Boolean
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

