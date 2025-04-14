export const buildQuery = (filters) => {
  const {
    typeReport,
    congestionLevel,
    account_id,
    startDate,
    endDate,
    analysisStatus,
  } = filters;

  const query = {};
  if (typeReport) query.typeReport = typeReport;
  if (congestionLevel) query.congestionLevel = congestionLevel;
  if (account_id) query.account_id = account_id;
  if (analysisStatus) query.analysisStatus = analysisStatus === "true";

  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  return query;
};

export const formatReport = (report) => ({
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
  roles: report.account_id.roles.map((role) => role.name),
  mediaFiles: report.media_files
    ? {
        url: report.media_files.media_url,
        type: report.media_files.media_type,
      }
    : null,
});