import { EXPIRATION_LIMITS } from '../../shared/constants/report.js'

export function filterValidReports(reports) {
  const now = Date.now();

  return reports.filter(report => {
    if (!report.timestamp) return false;

    const ts = new Date(report.timestamp).getTime();
    if (isNaN(ts)) return false;

    let limit = EXPIRATION_LIMITS.DEFAULT;
    if (report.typeReport === "TRAFFIC_JAM") limit = EXPIRATION_LIMITS.TRAFFIC_JAM;
    else if (report.typeReport === "FLOOD") limit = EXPIRATION_LIMITS.FLOOD;

    return now - ts <= limit;
  });
}
