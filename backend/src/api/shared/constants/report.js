export const ReportTypes = {
    TRAFFIC_JAM: "TRAFFIC_JAM",
    FLOOD: "FLOOD",
    ACCIDENT: "ACCIDENT",
    ROADWORK: "ROADWORK",
};

export const EXPIRATION_LIMITS = {
  TRAFFIC_JAM: 30 * 60 * 1000,    
  FLOOD: 60 * 60 * 1000,          
  DEFAULT: 90 * 60 * 1000,      
};