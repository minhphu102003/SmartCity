import AccountReportV2 from "../models/accountReport.js";

export const createAccountReportV2 = async (data) => {
  const report = new AccountReportV2(data);
  return await report.save();
};