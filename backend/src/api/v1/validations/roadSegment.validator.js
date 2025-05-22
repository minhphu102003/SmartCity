import { query, body } from 'express-validator';

export const validateGetRoadSegments = [
  query('longitude')
    .exists().withMessage('longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('longitude must be a valid number between -180 and 180'),

  query('latitude')
    .exists().withMessage('latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('latitude must be a valid number between -90 and 90'),

  query('distance')
    .optional()
    .isInt({ min: 1 }).withMessage('distance must be a positive integer'),

  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1 }).withMessage('limit must be a positive integer'),
];

export const validateUpdateRoadSegment = [
  body('groundwater_level')
    .optional()
    .isFloat().withMessage('groundwater_level must be a number'),

  body('roadName')
    .optional()
    .isString().withMessage('roadName must be a string')
    .notEmpty().withMessage('roadName cannot be empty'),
];