import {
  fetchOSRMData,
  insertUniqueRoadSegments,
  updateCamerasWithRoadSegment,
  updateReportsWithRoadSegment,
  processReportsForRoadSegment,
} from "../services/routes.service.js";
import Route from "../models/route.js";  // Import your Route model

export const findRoutesHandler = async (req, res, next) => {
  try {
    const { start, end, vehicleType = "drive" } = req.query;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Parse start and end coordinates from the query
    const [startLongitude, startLatitude] = start.split(',').map(Number);
    const [endLongitude, endLatitude] = end.split(',').map(Number);

    // Fetch routes from OSRM
    const routes = await fetchOSRMData(start, end, vehicleType);

    // Iterate over each route to process and add reports and recommended status
    for (const router of routes) {
      const { roadSegmentID, newRoadSegments } = await insertUniqueRoadSegments(router);

      // Update cameras and reports with new road segments
      for (const savedRoadSegment of newRoadSegments) {
        await updateReportsWithRoadSegment(
          savedRoadSegment._id,
          savedRoadSegment.start_location.coordinates,
          savedRoadSegment.end_location.coordinates,
          req.cachedReports
        );
        await updateCamerasWithRoadSegment(
          savedRoadSegment._id,
          savedRoadSegment.start_location.coordinates,
          savedRoadSegment.end_location.coordinates,
          req.cachedCameras
        );
      }

      // Collect recent reports for calculating the recommended status
      const recentReports = [];
      const processedAccountReportIds = new Set();
      const processedCameraReportIds = new Set();

      // Fetch and process Camera and Account reports for each road segment
      for (const id of roadSegmentID) {
        const { report } = await processReportsForRoadSegment(
          id,
          fiveMinutesAgo,
          processedAccountReportIds,
          processedCameraReportIds
        );
        recentReports.push(report);
      }

      // Flatten recentReports to check if any reports exist
      const flattenedReports = recentReports.flat();

      // Determine if the route is recommended based on the number of reports
      const recommended = flattenedReports.length === 0;

      // Add the `report` and `recommended` fields to the current route
      router.report = flattenedReports;  // Add recent reports to the route
      router.recommended = recommended;  // Add recommended flag to the route

      // Calculate the total distance (assumed to be in the response from OSRM)
      const totalDistance = router.distance;

      // Create a new Route document (optional: save to DB if needed)
      const route = new Route({
        start_location: {
          type: "Point",
          coordinates: [startLongitude, startLatitude],
        },
        end_location: {
          type: "Point",
          coordinates: [endLongitude, endLatitude],
        },
        segments: roadSegmentID,  // Assume this is an array of road segment IDs
        total_distance: totalDistance,
        recommended: recommended,
      });

      // Save the route to the database (optional: if you need to persist it)
      route.save();
    }

    // Send the response with the updated routes
    res.status(200).json({
      routes, // Return the routes array with the added fields
    });
  } catch (error) {
    console.error("Error fetching or storing routes:", error);
    res.status(500).json({ message: "Failed to fetch routes", error });
  }
};

