import { param } from "express-validator";

export const fetchUserProfileValidator = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage("USer id missing")
]