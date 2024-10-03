import { query, body  } from "express-validator";
import mongoose from 'mongoose';


export const getListHistoryValidator = [
    query('limit')
        .optional() // Không bắt buộc, nếu không có thì sử dụng giá trị mặc định
        .isInt({ min: 1 }).withMessage('Limit must be a positive integer'), // Giới hạn số lượng phải là số nguyên dương
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'), // Trang phải là số nguyên dương
];

// Validator cho API createHistory
export const createHistoryValidator = [
    body('search_query')
        .trim().notEmpty().withMessage('Search query is required')
        .isString().withMessage('Search query must be a string')
];

// Validator cho API deleteHistory
export const deleteHistoryValidator = [
    query('historyId')
        .optional()
        .custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid historyId'), // Kiểm tra ObjectId hợp lệ
    query('timeRange')
        .optional()
        .isIn(['30m', '1h', '8h', '12h', 'all']).withMessage('Invalid time range') // Kiểm tra timeRange hợp lệ
];


