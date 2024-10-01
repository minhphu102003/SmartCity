import { body, param } from "express-validator";
import User from '../models/user.js';
import {ROLES} from '../models/role.js';


export const validateCreateUser = [
    body('username')
        .trim().notEmpty().withMessage('Username is required.')
        .isString().withMessage('Username must be a string.')
        .isLength({min: 3}).withMessage('Username must be at least 3 characters long.')
        .custom( async (username) =>{
            const userExists = await User.findOne({username});
            if(userExists){
                throw new Error('Username already exists.');
            }
        }),
    body('email')
        .trim().notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Email is not valid.')
        .custom( async(email) =>{
            const userExists = await User.findOne({email});
            if(userExists){
                throw new Error('Email already exists.');
            }
        }),
    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number.'),
    body('roles')
        .optional()
        .isArray().withMessage('Roles must be an array of roles.')
        .custom((roles)=> {
            const invalidRoles = roles.filter (role =>  !ROLES.includes(role));
            if (invalidRoles.length > 0){
                throw new Error(`Invalid roles : ${invalidRoles.join(', ')}`);
            }
            return true;
        })
];


export const validateUpdateUser = [
    param('userId')
        .optional() // Có thể không có nếu người dùng tự cập nhật
        .isMongoId().withMessage('Invalid userId format.'),
    
    body('username')
        .optional()
        .trim().isString().withMessage('Username must be a string.')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.')
        .custom(async (username) => {
            const userExists = await User.findOne({ username });
            if (userExists) {
                throw new Error('Username already exists.');
            }
        }),
    
    body('email')
        .optional()
        .trim().isEmail().withMessage('Email is not valid.')
        .custom(async (email) => {
            const userExists = await User.findOne({ email });
            if (userExists) {
                throw new Error('Email already exists.');
            }
        }),
    
    body('password')
        .optional()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number.'),
    
    body('roles')
        .optional()
        .isArray().withMessage('Roles must be an array of roles.')
        .custom((roles) => {
            const invalidRoles = roles.filter(role => !ROLES.includes(role));
            if (invalidRoles.length > 0) {
                throw new Error(`Invalid roles: ${invalidRoles.join(', ')}`);
            }
            return true;
        }),
];


