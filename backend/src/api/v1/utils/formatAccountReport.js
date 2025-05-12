export const formatAccountReport = (report) => {
  if (!report || !report.account_id) return null;

  return {
    reportId: report._id,
    description: report.description,
    typeReport: report.typeReport,
    congestionLevel: report.congestionLevel,
    analysisStatus: report.analysisStatus,
    longitude: report.location.coordinates[0],
    latitude: report.location.coordinates[1],
    timestamp: report.timestamp,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    imgs: report.listImg,
    accountId: report.account_id._id,
    username: report.account_id.username,
    roles: report.account_id.roles?.map((role) => role.name) || [],
  };
};
