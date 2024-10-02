import {body} from "express-validator";

export const validateCreateComment = [
    body('star')
        .isInt({ min: 1, max: 5 }) // Giả sử đánh giá từ 1 đến 5
        .withMessage('Star must be an integer between 1 and 5.'),
    body('place_id')
        .isMongoId()
        .withMessage('Place ID must be a valid MongoDB ID.'),
    body('image')
        .optional() // Nếu không có, không cần thiết phải gửi
        .isURL()
        .withMessage('Image must be a valid URL.'),
];


export const validateUpdateComment = [
    body('star')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Star must be an integer between 1 and 5.'),
    body('content')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Content cannot be empty.'),
    body('image')
        .optional() // Nếu không có, không cần thiết phải gửi
        .isURL()
        .withMessage('Image must be a valid URL.'),
];
