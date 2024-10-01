import {header, param} from "express-validator";

export const validateById = [
    param('Id')
        .isMongoId()
        .withMessage('Invalid userId format')
        .exists({ checkNull: true, checkFalsy: true })
];

export const validateWithToken = [
    header('x-access-token')
        .notEmpty()
        .withMessage('Token is required')
];