import {
  fetchOSRMData,
  calculateMinDistanceFromPointToGeometry,
} from "../services/routes.service.js";
import polyline from "polyline";
import { filterValidReports } from "../utils/filterReport.js";
import { hasSignificantDifference } from "../utils/hasSignificantDifference.js";

export const findRoutesHandler = async (req, res) => {
  try {
    const { start, end, vehicleType = "drive" } = req.query;

    // req.cachedReportsForRouting = filterValidReports(
    //   req.cachedReportsForRouting
    // );

    const interceptedRoutes = [];
    const routes = await fetchOSRMData(start, end, vehicleType);
    let newRoutes1 = [];
    let originalCoords = [];
    let reportResult = [];

    for (const router of routes) {
      let foundReport = false;
      let prefixIntersections = [];

      for (const leg of router.legs) {
        for (const step of leg.steps) {
          const geometry = step.geometry;

          for (const report of req.cachedReportsForRouting) {
            const pointCoords = [report.longitude, report.latitude];
            const distance = calculateMinDistanceFromPointToGeometry(
              pointCoords,
              geometry
            );

            if (distance < 30) {
              reportResult.push(report);
              originalCoords = polyline.decode(step.geometry);
              foundReport = true;
              break;
            }
          }

          if (foundReport) break;

          if (step.intersections && step.intersections.length > 0) {
            for (const intersection of step.intersections) {
              if (intersection.location) {
                prefixIntersections.push(intersection.location);
              }
            }
          }
        }

        if (foundReport) break;
      }

      if (foundReport && prefixIntersections.length > 0) {
        const interceptorPoint =
          prefixIntersections[prefixIntersections.length - 1];
        const newRoute = await fetchOSRMData(
          interceptorPoint,
          end,
          vehicleType
        );

        for (const router of newRoute) {
          const newRouteCoords = polyline.decode(router.geometry);

          const different = hasSignificantDifference(
            originalCoords,
            newRouteCoords
          );

          if (different) {
            if (newRoutes1.length >= 2) break;
            newRoutes1.push(router);
          }

          interceptedRoutes.push({
            startToIntercept: prefixIntersections,
            interceptToEnd: newRoute,
          });
        }
      }
    }

    const responsePayload = { routes };

    if (newRoutes1 && newRoutes1.length !== 0) {
      responsePayload.newRoutes1 = newRoutes1;
    }

    if (reportResult && reportResult.length !== 0) {
      responsePayload.reports = reportResult;
    }

    res.status(200).json(responsePayload);

  } catch (error) {
    console.error("Error fetching or storing routes:", error);
    res.status(500).json({ message: "Failed to fetch routes", error });
  }
};
