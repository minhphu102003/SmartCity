export const buildNotificationMessage = (
  type,
  typeReport,
  description,
  timestamp,
  latitude,
  longitude,
  img
) => {
  const reportTypeMap = {
    TRAFFIC_JAM: "Traffic Jam",
    FLOOD: "Flood",
    ACCIDENT: "Accident",
    ROADWORK: "Road Work",
  };

  const typeDescription = reportTypeMap[typeReport] || "Unknown";

  return {
    title: `${typeDescription} notification`,
    content: `${typeDescription} reported near you: ${description}`,
    typeReport: typeReport,
    status: "PENDING",
    isRead: false,
    timestamp,
    distance: "",
    longitude,
    latitude,
    img,
  };
};
