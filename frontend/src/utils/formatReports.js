import { haversineDistance } from './distances';

export const formatReports = (data, userLocation) => {
  if (!Array.isArray(data) || data.length === 0 || !userLocation) {
    return [];
  }

  // ? Trả về đơn vị meters
  return data.map((report) => {
    const distance = haversineDistance(
      userLocation.latitude,
      userLocation.longitude,
      report.latitude,
      report.longitude
    );

    return {
      reportId: report.reportId,
      description: report.description,
      typeReport: report.typeReport,
      congestionLevel: report.congestionLevel,
      analysisStatus: report.analysisStatus,
      longitude: report.longitude,
      latitude: report.latitude,
      timestamp: report.timestamp,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      img: report.imgs[0].img || [],
      distance,
      accountId: report.accountId,
      username: report.username,
      roles: report.roles,
    };
  });
};
