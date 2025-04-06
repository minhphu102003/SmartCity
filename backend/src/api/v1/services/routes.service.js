import polyline from "polyline";
import axios from "axios";
import CameraReport from "../models/cameraReport.js";
import AccountReport from "../models/accountReport.js";

// Helper function to call OSRM API and fetch route data
export const fetchOSRMData = async (start, end, vehicleType) => {
  const osrmUrl = `https://router.project-osrm.org/route/v1/${vehicleType}/${start};${end}?alternatives=true&steps=true`;
  const osrmResponse = await axios.get(osrmUrl);
  return osrmResponse.data.routes;
};


// Helper function to format reports into a unified structure
const mergeReports = (cameraReports, accountReports) => {
  // Extract and format camera reports
  const formattedCameraReports = cameraReports.map((report) => ({
    trafficVolume: report.trafficVolume,
    congestionLevel: report.congestionLevel,
    typeReport: report.typeReport,
    img: report.img[0].img, // Lấy hình ảnh
    timestamp: report.timestamp,
    latitude: report.camera_id?.location?.coordinates[1], // Lấy latitude từ camera_id
    longitude: report.camera_id?.location?.coordinates[0], // Lấy longitude từ camera_id
  }));
  // Extract and format account reports with placeholder for trafficVolume
  const formattedAccountReports = accountReports.map((report) => ({
    trafficVolume: null,
    congestionLevel: report.congestionLevel,
    typeReport: report.typeReport,
    img: report.listImg[0].img, // `img` is formatted in processReportsForRoadSegment
    timestamp: report.timestamp,
    latitude: report.location?.coordinates[1],
    longitude: report.location?.coordinates[0],
  }));

  return [...formattedCameraReports, ...formattedAccountReports];
};

// Lấy các báo cáo gần đây trong 5 phút qua từ MongoDB 
export const getRecentAccountReports = async (fiveMinutesAgo) => {
  try {
    return await AccountReport.find({
      timestamp: { $gte: fiveMinutesAgo },
    });
  } catch (error) {
    console.error("Error fetching recent account reports:", error);
    throw error;
  }
};

export const getRecentCameraReports = async (fiveMinutesAgo) => {
  try {
    return await CameraReport.find({
      timestamp: { $gte: fiveMinutesAgo },
    })
      .populate("camera_id", "location") // Populate thông tin location từ camera_id
      .sort({ timestamp: -1 }); // Sắp xếp theo thời gian giảm dần
  } catch (error) {
    console.error("Error fetching recent camera reports:", error);
    throw error;
  }
};

const calculateDistanceToLineManual = (pointCoords, lineCoords) => {
  const DEG_TO_METERS = 111320; 
  const [x0, y0] = pointCoords;
  const [[x1, y1], [x2, y2]] = lineCoords;

  const x0Meters = x0 * DEG_TO_METERS;
  const y0Meters = y0 * DEG_TO_METERS;
  const x1Meters = x1 * DEG_TO_METERS;
  const y1Meters = y1 * DEG_TO_METERS;
  const x2Meters = x2 * DEG_TO_METERS;
  const y2Meters = y2 * DEG_TO_METERS;

  const ABx = x2Meters - x1Meters;
  const ABy = y2Meters - y1Meters; 
  const APx = x0Meters - x1Meters;
  const APy = y0Meters - y1Meters;

  const dotProduct = APx * ABx + APy * ABy; 
  const lengthSquared = ABx * ABx + ABy * ABy; 
  const t = Math.max(0, Math.min(1, dotProduct / lengthSquared));

  const nearestX = x1Meters + t * ABx; 
  const nearestY = y1Meters + t * ABy; 

  const distance = Math.sqrt(
    (x0Meters - nearestX) ** 2 + (y0Meters - nearestY) ** 2
  );
  return distance; 
};

export const findAlternativeRoutes = async (route, fiveMinutesAgo, end) => {
  try {
    const [cameraReports, accountReports] = await Promise.all([
      getRecentCameraReports(fiveMinutesAgo),
      getRecentAccountReports(fiveMinutesAgo),
    ]);
    const mergedReports = mergeReports(cameraReports, accountReports);

    const steps = route?.legs?.flatMap((leg) => leg.steps) || [];

    const allCoordinates = [];
    const relevantReports = [];
    const avoidSegments = new Set();
    const stack = [];
    let foundFirstReport = false;

    // Xử lý từng bước của route
    for (const step of steps) {
      const coordinates = polyline.decode(step.geometry);
      for (let i = 0; i < coordinates.length - 1; i++) {
        const startCoord = coordinates[i];
        const endCoord = coordinates[i + 1];
        const roadSegment = {
          start_location: {
            type: "Point",
            coordinates: [startCoord[1], startCoord[0]], // [longitude, latitude]
          },
          end_location: {
            type: "Point",
            coordinates: [endCoord[1], endCoord[0]], // [longitude, latitude]
          },
          roadSegmentLine: {
            type: "LineString",
            coordinates: [
              [startCoord[1], startCoord[0]],
              [endCoord[1], endCoord[0]],
            ],
          },
        };

        let shouldAvoid = false;

        if (!foundFirstReport) {
          stack.push(roadSegment.roadSegmentLine.coordinates[0]);
        }

        mergedReports.forEach((report) => {
          const reportCoords = [report.longitude, report.latitude];
          const distance = calculateDistanceToLineManual(
            reportCoords,
            roadSegment.roadSegmentLine.coordinates
          );
          if (distance <= 25) {
            relevantReports.push({ ...report, roadSegment });
            avoidSegments.add(JSON.stringify(roadSegment.roadSegmentLine.coordinates));
            shouldAvoid = true;
            foundFirstReport = true;
          }
        });

        if (!shouldAvoid) {
          allCoordinates.push(roadSegment.roadSegmentLine.coordinates);
        }
      }
    }

    // Tìm đường thay thế
    // let alternativeRoute = [];
    // for (const avoidSegmentJson of avoidSegments) {
    //   const avoidSegment = JSON.parse(avoidSegmentJson);
    
    //   while (stack.length > 0) {
    //     const from = stack.pop();
    //     const responseRoutes = await fetchOSRMData(
    //       `${from[0]},${from[1]}`,
    //       `${end[0]},${end[1]}`,
    //       "drive"
    //     );
    
    //     for (const route of responseRoutes) {
    //       const newRouteCoordinates = polyline.decode(route.geometry);
    //       const isValidRoute = newRouteCoordinates.every((coord) =>
    //         avoidSegment.every(
    //           (segCoord) =>
    //             // Kiểm tra sự trùng lặp với đoạn đường tránh (avoidSegment)
    //             JSON.stringify([coord[1], coord[0]]) !== JSON.stringify(segCoord)
    //         )
    //       );
    
    //       if (isValidRoute) {
    //         alternativeRoute = [
    //           ...allCoordinates.flat(),
    //           ...newRouteCoordinates,
    //         ];
    //         break;
    //       }
    //     }
    
    //     if (alternativeRoute.length > 0) {
    //       break;
    //     }
    //   }
    
    //   if (alternativeRoute.length > 0) {
    //     break;
    //   }
    // }
    // console.log(`Alternative routes ${alternativeRoute}`);
    // const encodedGeometry = alternativeRoute.length === 0 
    // ? '' // Nếu không có tuyến thay thế, trả về geometry rỗng
    // : polyline.encode(alternativeRoute); // Nếu có, mã hóa lại geometry mới
    return {
      geometry: '',
      recentReports: relevantReports,
    };
  } catch (error) {
    console.error("Error finding alternative routes:", error);
    throw error;
  }
};