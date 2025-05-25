import polyline from "polyline";
import axios from "axios";

export const fetchOSRMData = async (start, end, vehicleType) => {
  const osrmUrl = `https://router.project-osrm.org/route/v1/${vehicleType}/${start};${end}?alternatives=true&steps=true`;
  const osrmResponse = await axios.get(osrmUrl);
  return osrmResponse.data.routes;
};


const calculateDistanceToLineManual = (pointCoords, lineCoords) => {
  const MAX_DISTANCE = 1e6;
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

  const lengthSquared = ABx * ABx + ABy * ABy;

  if (lengthSquared === 0) {
    const distance = Math.sqrt(
      (x0Meters - x1Meters) ** 2 + (y0Meters - y1Meters) ** 2
    );
    return distance;
  }

  const dotProduct = APx * ABx + APy * ABy;
  const t = Math.max(0, Math.min(1, dotProduct / lengthSquared));

  const nearestX = x1Meters + t * ABx;
  const nearestY = y1Meters + t * ABy;

  const distance = Math.sqrt(
    (x0Meters - nearestX) ** 2 + (y0Meters - nearestY) ** 2
  );
  return isFinite(distance) ? distance : MAX_DISTANCE;
};

export const calculateMinDistanceFromPointToGeometry = (pointCoords, polylineString) => {
  const MAX_DISTANCE = 1e6;

  let latLngPairs;
  try {
    latLngPairs = polyline.decode(polylineString);
  } catch (e) {
    return MAX_DISTANCE;
  }

  if (!Array.isArray(latLngPairs) || latLngPairs.length < 2) {
    return MAX_DISTANCE;
  }

  const lineCoords = latLngPairs.map(([lat, lng]) => [lng, lat]);
  let minDistance = MAX_DISTANCE;

  for (let i = 0; i < lineCoords.length - 1; i++) {
    const segment = [lineCoords[i], lineCoords[i + 1]];
    if (
      segment[0][0] === segment[1][0] &&
      segment[0][1] === segment[1][1]
    ) {
      continue;
    }

    const distance = calculateDistanceToLineManual(pointCoords, segment);

    if (distance < minDistance) {
      minDistance = distance;
    }
  }

  return minDistance;
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