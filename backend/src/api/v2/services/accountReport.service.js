import AccountReportV2 from "../models/accountReport.js";
import { populateAccountInfo } from '../utils/accountPopulate.js';

export const createAccountReportV2 = async (data) => {
  const report = new AccountReportV2(data);
  return await report.save();
};

export const getAccountReports = async (query, skip, limit) => {
  const reports = await AccountReportV2.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate(populateAccountInfo())
    .exec();

  const totalReports = await AccountReportV2.countDocuments(query);

  return { reports, totalReports };
};

export const getAccountReportById = async (id) => {
  return await AccountReportV2.findById(id)
    .populate(populateAccountInfo())
    .exec();
};