import {header, param} from "express-validator";

export const validateById = [
    param('id')
        .isMongoId()
        .withMessage('Invalid id format')
        .exists({ checkNull: true, checkFalsy: true })
];

export const validateWithToken = [
    header('x-access-token')
        .notEmpty()
        .withMessage('Token is required')
];