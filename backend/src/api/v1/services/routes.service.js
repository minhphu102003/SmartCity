import polyline from "polyline";
import axios from "axios";
import Camera from "../models/camera.js";
import RoadSegment from "../models/roadSegment.js";
import CameraReport from "../models/cameraReport.js";
import AccountReport from "../models/accountReport.js";
import haversine from "haversine-distance";
import { point, lineString, geometry } from "@turf/helpers";
import distanceToLine from "@turf/nearest-point-to-line";
import nearestPointToLine from "@turf/nearest-point-to-line";

// Helper function to call OSRM API and fetch route data
export const fetchOSRMData = async (start, end, vehicleType) => {
  const osrmUrl = `https://router.project-osrm.org/route/v1/${vehicleType}/${start};${end}?alternatives=true&steps=true`;
  const osrmResponse = await axios.get(osrmUrl);
  return osrmResponse.data.routes;
};

// Hàm kiểm tra và chèn đoạn đường
export const insertUniqueRoadSegments = async (router) => {
  const roadSegmentIds = [];

  // Duyệt qua từng route để tạo danh sách roadSegments
  const roadSegments = generateRoadSegmentsFromRoute(router);

  // Mảng để lưu các đoạn đường chưa tồn tại trong database
  const newRoadSegmentsToInsert = [];

  for (const roadSegment of roadSegments) {
    const existingSegment = await RoadSegment.findOne({
      roadSegmentLine: roadSegment.roadSegmentLine,
    });

    if (existingSegment) {
      // Nếu đoạn đường đã tồn tại, thêm _id vào mảng
      roadSegmentIds.push(existingSegment._id);
    } else {
      // Nếu đoạn đường chưa có, thêm vào mảng để insert
      newRoadSegmentsToInsert.push(roadSegment);
    }
  }

  // Chèn các đoạn đường mới vào database và lấy _id của chúng
  const newRoadSegments = await RoadSegment.insertMany(
    newRoadSegmentsToInsert,
    { ordered: false }
  );

  // Lấy ra _id của các đoạn đường vừa chèn và thêm vào mảng roadSegmentIds
  newRoadSegments.forEach((segment) => roadSegmentIds.push(segment._id));

  return {
    roadSegmentID: roadSegmentIds, // Trả về mảng _id của tất cả các đoạn đường
    newRoadSegments: newRoadSegments, // Trả về các đoạn đường mới chèn vào
  };
};

// Hàm tạo roadSegments từ route geometry
const generateRoadSegmentsFromRoute = (route) => {
  const coordinates = polyline.decode(route.geometry);
  const roadSegments = [];

  for (let i = 0; i < coordinates.length - 1; i++) {
    const startCoord = coordinates[i];
    const endCoord = coordinates[i + 1];

    roadSegments.push({
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
          [startCoord[1], startCoord[0]], // [longitude, latitude] for start
          [endCoord[1], endCoord[0]], // [longitude, latitude] for end
        ],
      },
      congestionLevel: null, // Đặt ban đầu là null
    });
  }

  return roadSegments;
};

export const findTrafficJamReport = async (roadSegment, apiCallTime) => {
  const fiveMinutesAgo = new Date(apiCallTime.getTime() - 5 * 60000);

  // Step 1: Get the latest CameraReport within the last 5 minutes
  const recentCameraReport = await CameraReport.findOne({
    roadSegment_id: roadSegment._id,
    timestamp: { $gte: fiveMinutesAgo },
    congestionLevel: { $ne: "NO_CONGESTION" },
  })
    .sort({ timestamp: -1 }) // Get the most recent report
    .exec();

  // Step 2: Get nearby AccountReports within 5 minutes and 20 meters
  const recentAccountReports = await AccountReport.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: roadSegment.start_location.coordinates,
        },
        $maxDistance: 20, // 20 meters
      },
    },
    timestamp: { $gte: fiveMinutesAgo },
    congestionLevel: { $ne: "NO_CONGESTION" },
  })
    .sort({ timestamp: -1 }) // Sort by most recent first
    .exec();

  // Step 3: Structure the response with img as an array in both reports
  return {
    cameraReport: recentCameraReport
      ? {
          typeReport: recentCameraReport.typeReport, // from schema enum
          timestamp: recentCameraReport.timestamp,
          congestionLevel: recentCameraReport.congestionLevel,
          location: recentCameraReport.location,
          img: [recentCameraReport.img], // Wrap in array for consistency
        }
      : null,

    accountReports: recentAccountReports.map((report) => ({
      typeReport: report.typeReport, // from schema enum
      timestamp: report.timestamp,
      congestionLevel: report.congestionLevel,
      location: report.location,
      img: report.img, // Already an array for AccountReport
    })),
  };
};

// Helper function to update cameras associated with road segments
export const updateCamerasWithRoadSegment = async (
  roadSegmentId,
  startLocation,
  endLocation,
  cachedCameras
) => {
  const radius = 20; // Mức sai số khoảng 10m

  // Use cached cameras instead of querying the database
  const camerasToUpdate = cachedCameras.filter((camera) => {
    if (!camera.location || !camera.location.coordinates) return false;

    // Calculate the distance from the camera to the line segment using the point-to-line distance formula
    const cameraLocation = camera.location.coordinates;
    const distance = calculateDistanceFromLine(
      cameraLocation,
      startLocation,
      endLocation
    );

    return distance <= radius;
  });

  for (const camera of camerasToUpdate) {
    if (!camera.roadSegments.includes(roadSegmentId)) {
      camera.roadSegments.push(roadSegmentId);
      await camera.save();
    }
    // 2. Tìm tất cả các CameraReport của camera này
    const cameraReports = await CameraReport.find({ camera_id: camera._id });

    // 3. Cập nhật các CameraReport vào mảng reports của RoadSegment
    for (const report of cameraReports) {
      // Tìm RoadSegment có id tương ứng
      const roadSegment = await RoadSegment.findById(roadSegmentId);

      if (roadSegment && !roadSegment.reports.includes(report._id)) {
        roadSegment.reports.push(report._id); // Thêm report vào mảng reports
        await roadSegment.save(); // Lưu lại RoadSegment
      }
    }
  }
};

// Helper function to update reports associated with road segments
export const updateReportsWithRoadSegment = async (
  roadSegmentId,
  startLocation,
  endLocation,
  cachedReports
) => {
  const radius = 25; // 10 meters

  // Filter cached reports to find those near the new road segment
  const reportsToUpdate = cachedReports.filter((report) => {
    if (!report.location || !report.location.coordinates) return false;

    // Calculate the distance from the report to the line segment
    const reportLocation = report.location.coordinates;
    const distance = calculateDistanceFromLine(
      reportLocation,
      startLocation,
      endLocation
    );

    return distance <= radius;
  });

  for (const report of reportsToUpdate) {
    if (!report.roadSegment_ids.includes(roadSegmentId)) {
      report.roadSegment_ids.push(roadSegmentId); // Thêm đoạn đường vào danh sách liên kết
      await report.save();
    }
  }
};

// Helper function to calculate distance from a point to a line segment (in meters)
const calculateDistanceFromLine = (point, lineStart, lineEnd) => {
  const [px, py] = point;
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;

  const lineLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const u = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lineLength ** 2;

  const closestPoint = [x1 + u * (x2 - x1), y1 + u * (y2 - y1)];

  const dx = px - closestPoint[0];
  const dy = py - closestPoint[1];

  return Math.sqrt(dx ** 2 + dy ** 2); // Distance in meters
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

export const processReportsForRoadSegment = async (
  roadSegmentId,
  fiveMinutesAgo,
  processedAccountReportIds,
  processedCameraReportIds
) => {
  const recentReports = [];
  const recentAccountReports = [];

  const cameras = await Camera.find({ roadSegments: roadSegmentId });

  for (const camera of cameras) {
    const recentCameraReport = await getRecentCameraReport(
      camera._id,
      fiveMinutesAgo
    );

    if (
      recentCameraReport &&
      !processedCameraReportIds.has(recentCameraReport._id.toString())
    ) {
      // Add the CameraReport if it's unique
      processedCameraReportIds.add(recentCameraReport._id.toString());

      recentCameraReport.img = Array.isArray(recentCameraReport.img)
        ? recentCameraReport.img
        : [recentCameraReport.img];
      recentReports.push(recentCameraReport);

      // Fetch nearby AccountReports
      const nearbyAccountReports = await getNearbyAccountReports(
        recentCameraReport,
        roadSegmentId,
        fiveMinutesAgo
      );
      for (const accountReport of nearbyAccountReports) {
        const distance = haversine(
          {
            lat: recentCameraReport.location.coordinates[1],
            lon: recentCameraReport.location.coordinates[0],
          },
          {
            lat: accountReport.location.coordinates[1],
            lon: accountReport.location.coordinates[0],
          }
        );

        if (
          distance > 25 &&
          !processedAccountReportIds.has(accountReport._id.toString())
        ) {
          accountReport.img = Array.isArray(accountReport.listImg)
            ? accountReport.listImg
            : [accountReport.listImg];
          recentAccountReports.push(accountReport);
          processedAccountReportIds.add(accountReport._id.toString());
        }
      }
    } else if (!recentCameraReport) {
      // If no CameraReport, fetch AccountReports within the past 5 minutes
      const accountReports = await AccountReport.find({
        roadSegment_ids: roadSegmentId,
        timestamp: { $gte: fiveMinutesAgo },
      });
      for (const accountReport of accountReports) {
        if (!processedAccountReportIds.has(accountReport._id.toString())) {
          accountReport.img = Array.isArray(accountReport.listImg)
            ? accountReport.listImg
            : [accountReport.listImg];
          recentAccountReports.push(accountReport);
          processedAccountReportIds.add(accountReport._id.toString());
        }
      }
    }
  }

  const accountReports = await AccountReport.find({
    roadSegment_ids: roadSegmentId,
    timestamp: { $gte: fiveMinutesAgo },
  });

  console.log(accountReports);
  for (const accountReport of accountReports) {
    if (!processedAccountReportIds.has(accountReport._id.toString())) {
      accountReport.img = Array.isArray(accountReport.listImg)
        ? accountReport.listImg
        : [accountReport.listImg];
      recentAccountReports.push(accountReport);
      processedAccountReportIds.add(accountReport._id.toString());
    }
  }

  return { report: mergeReports(recentReports, recentAccountReports) };
};

// Tìm CameraReport mới nhất trong 5 phút gần nhất
export const getRecentCameraReport = async (cameraId, fiveMinutesAgo) => {
  return await CameraReport.findOne({
    camera_id: cameraId,
    timestamp: { $gte: fiveMinutesAgo },
  })
    .populate("camera_id", "location") // Populate chỉ lấy thông tin 'location' của camera
    .sort({ timestamp: -1 });
};

// Tìm AccountReports gần CameraReport trong bán kính 20m và thời gian 5 phút
export const getNearbyAccountReports = async (
  cameraReport,
  roadSegmentId,
  fiveMinutesAgo
) => {
  return await AccountReport.find({
    roadSegment_ids: roadSegmentId, // Kiểm tra trong mảng roadSegment_ids
    timestamp: { $gte: fiveMinutesAgo }, // Chỉ lấy các báo cáo trong 5 phút gần đây
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: cameraReport.location.coordinates,
        },
        $maxDistance: 20, // 20 mét
      },
    },
  });
};

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

  // Chuyển độ sang mét
  const x0Meters = x0 * DEG_TO_METERS;
  const y0Meters = y0 * DEG_TO_METERS;
  const x1Meters = x1 * DEG_TO_METERS;
  const y1Meters = y1 * DEG_TO_METERS;
  const x2Meters = x2 * DEG_TO_METERS;
  const y2Meters = y2 * DEG_TO_METERS;

  // Vector AB và AP
  const ABx = x2Meters - x1Meters;
  const ABy = y2Meters - y1Meters;
  const APx = x0Meters - x1Meters;
  const APy = y0Meters - y1Meters;

  // Tính t (tỷ lệ chiếu điểm P lên đoạn AB)
  const dotProduct = APx * ABx + APy * ABy; // (AP) · (AB)
  const lengthSquared = ABx * ABx + ABy * ABy; // (AB) · (AB)
  const t = Math.max(0, Math.min(1, dotProduct / lengthSquared)); // Giới hạn t trong [0, 1]

  // Tìm tọa độ điểm gần nhất trên đoạn thẳng
  const nearestX = x1Meters + t * ABx;
  const nearestY = y1Meters + t * ABy;

  // Tính khoảng cách từ P đến điểm gần nhất
  const distance = Math.sqrt(
    (x0Meters - nearestX) ** 2 + (y0Meters - nearestY) ** 2
  );

  return distance; // Đơn vị mét
};

export const findReportsForRoute = async (route, fiveMinutesAgo) => {
  try {
    // 1. Tìm tất cả CameraReports và AccountReports
    const [cameraReports, accountReports] = await Promise.all([
      getRecentCameraReports(fiveMinutesAgo),
      getRecentAccountReports(fiveMinutesAgo),
    ]);
    // 2. Hợp nhất dữ liệu từ CameraReports và AccountReports
    const mergedReports = mergeReports(cameraReports, accountReports);
    // 3. Giải mã polyline và tạo các đoạn đường
    const coordinates = polyline.decode(route.geometry);
    const roadSegments = [];
    const relevantReports = [];

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
            [startCoord[1], startCoord[0]], // [longitude, latitude] for start
            [endCoord[1], endCoord[0]], // [longitude, latitude] for end
          ],
        },
        congestionLevel: null, // Đặt ban đầu là null
      };

      roadSegments.push(roadSegment);

      // 4. Kiểm tra từng report với đoạn đường này
      mergedReports.forEach((report) => {
        const reportCoords = [report.longitude, report.latitude];
        const distance = calculateDistanceToLineManual(
          reportCoords,
          roadSegment.roadSegmentLine.coordinates
        );
        if (distance <= 25) {
          relevantReports.push({ ...report, roadSegment });
        }
      });
    }

    return relevantReports;
  } catch (error) {
    console.error("Error finding reports for route:", error);
    throw error;
  }
};

export const findAlternativeRoutes = async (route, fiveMinutesAgo, end) => {
  try {
    const [cameraReports, accountReports] = await Promise.all([
      getRecentCameraReports(fiveMinutesAgo),
      getRecentAccountReports(fiveMinutesAgo),
    ]);
    const mergedReports = mergeReports(cameraReports, accountReports);

    const steps = route?.legs?.flatMap((leg) => leg.steps) || [];
    // if (!steps.length) {
    //   throw new Error("Invalid route data: no steps available");
    // }

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

        // Lưu intersections nếu chưa tìm thấy report đầu tiên
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
    let alternativeRoute = [];
    for (const avoidSegmentJson of avoidSegments) {
      const avoidSegment = JSON.parse(avoidSegmentJson);
    
      while (stack.length > 0) {
        const from = stack.pop();
        const responseRoutes = await fetchOSRMData(
          `${from[0]},${from[1]}`,
          `${end[0]},${end[1]}`,
          "drive"
        );
    
        for (const route of responseRoutes) {
          const newRouteCoordinates = polyline.decode(route.geometry);
    
          // Kiểm tra nếu đoạn đường mới trùng với các avoidSegments
          const isValidRoute = newRouteCoordinates.every((coord) =>
            avoidSegment.every(
              (segCoord) =>
                // Kiểm tra sự trùng lặp với đoạn đường tránh (avoidSegment)
                JSON.stringify([coord[1], coord[0]]) !== JSON.stringify(segCoord)
            )
          );
    
          if (isValidRoute) {
            alternativeRoute = [
              ...allCoordinates.flat(),
              ...newRouteCoordinates,
            ];
            break;
          }
        }
    
        if (alternativeRoute.length > 0) {
          break;
        }
      }
    
      if (alternativeRoute.length > 0) {
        break;
      }
    }
    console.log(`Alternative routes ${alternativeRoute}`);
    const encodedGeometry = alternativeRoute.length === 0 
    ? '' // Nếu không có tuyến thay thế, trả về geometry rỗng
    : polyline.encode(alternativeRoute); // Nếu có, mã hóa lại geometry mới
  
    return {
      geometry: encodedGeometry,
      recentReports: relevantReports,
    };
  } catch (error) {
    console.error("Error finding alternative routes:", error);
    throw error;
  }
};
