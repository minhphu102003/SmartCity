import { body, query } from "express-validator";
import mongoose from "mongoose";

import { paginationValidator } from '../../shared/validation/pagination.validator.js';
import { StatusReview } from "../constants/index.js";

export const createAccountReportReviewValidator = [
  body("accountReport_id")
    .notEmpty()
    .withMessage("accountReport_id is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid accountReport_id"),

  body("reason")
    .notEmpty()
    .withMessage("Reason is required")
    .isString()
    .withMessage("Reason must be a string"),
];

export const getAccountReportReviewsValidator = [
  ... paginationValidator,
  
  query("reviewed_by")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid reviewed_by ID"),

  query("status")
    .optional()
    .isIn(Object.values(StatusReview))
    .withMessage(`Status must be one of: ${Object.values(StatusReview).join(", ")}`),
];

export const updateAccountReportReviewValidator = [
  body("reason")
    .optional()
    .isString()
    .withMessage("Reason must be a string"),

  body("status")
    .optional()
    .isIn(Object.values(StatusReview))
    .withMessage(`Status must be one of: ${Object.values(StatusReview).join(", ")}`),
];