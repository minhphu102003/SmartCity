import AccountReportReview from "../models/accountReportReview.js";
import AccountReport from "../../v1/models/accountReport.js";
import { StatusReview } from "../constants/index.js";
import { populateAccountInfor } from '../utils/accountPopulate.js';

export const createAccountReportReview = async ({ accountReport_id, reason, account_id }) => {

  const accountReportExists = await AccountReport.findById(accountReport_id);
  if (!accountReportExists) {
    throw new Error("AccountReport not found");
  }

  const newReview = new AccountReportReview({
    accountReport_id,
    reason,
    status: StatusReview.PENDING,
    reviewed_by: account_id,
    reviewed_at: new Date(),
  });

  return await newReview.save();
};

export const getAccountReportReviews = async (filters, page = 1, limit = 10) => {
  const query = {};

  if (filters.reviewed_by) {
    query.reviewed_by = filters.reviewed_by;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  const skip = (page - 1) * limit;

  const totalReports = await AccountReportReview.countDocuments(query);

  const reviews = await AccountReportReview.find(query)
    .skip(skip)
    .limit(limit)
    .populate("accountReport_id")
    .populate({
      path: "reviewed_by",
      ...populateAccountInfor(),
    });

  return { reviews, totalReports };
};

export const getAccountReportReviewById = async (id) => {
  return await AccountReportReview.findById(id)
    .populate("accountReport_id")
    .populate({
      path: "reviewed_by",
      ...populateAccountInfor(),
    });
};

export const updateAccountReportReview = async (id, updateData) => {
  const updateFields = {};
  if (updateData.reason) {
    updateFields.reason = updateData.reason;
  }
  if (updateData.status) {
    updateFields.status = updateData.status;
  }
  return await AccountReportReview.findByIdAndUpdate(id, updateFields, { new: true });
};

export const deleteAccountReportReview = async (id) => {
  return await AccountReportReview.findByIdAndDelete(id);
};