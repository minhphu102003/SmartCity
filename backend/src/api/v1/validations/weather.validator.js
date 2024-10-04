import { query } from "express-validator";

// Validator cho API getClothingSuggestion
export const validateWeatherQuery = [
    query('lon')
        .exists().withMessage('Thiếu thông tin longitude')
        .isFloat({ min: -180, max: 180 }).withMessage('Longitude phải là số và nằm trong khoảng từ -180 đến 180'),
    query('lat')
        .exists().withMessage('Thiếu thông tin latitude')
        .isFloat({ min: -90, max: 90 }).withMessage('Latitude phải là số và nằm trong khoảng từ -90 đến 90')
];