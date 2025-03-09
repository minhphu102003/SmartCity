import {
  fetchOSRMData,
  findAlternativeRoutes
} from "../services/routes.service.js";
import { Route } from '../models/index.js';


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
      // const recentReports = await findReportsForRoute(router,fiveMinutesAgo);
      const {geometry, recentReports} = await findAlternativeRoutes(router,fiveMinutesAgo, end);

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
        }, // Assume this is an array of road segment IDs
        total_distance: totalDistance,
        recommended: recommended,
      });
      if (geometry && geometry !== "") {
        routes.push({
          geometry: geometry,
          weight_name: "routability",
          weight: 138.1,
          duration: 138.1,
          distance: 1775.7,
          report: [],
          recommended: true,
          legs: [
            {
              steps: [
                {
                  geometry: "ucbaB}`lsScAH_AFM@", // Dữ liệu geometry cứng của bước này
                  maneuver: {
                    bearing_after: 353,
                    bearing_before: 0,
                    location: [
                      108.201265,  // Longtitude
                      16.072431    // Latitude
                    ],
                    modifier: "left",
                    type: "depart"
                  },
                  mode: "driving",
                  driving_side: "right",
                  name: "Đường Tôn Thất Đạm",
                  intersections: [
                    {
                      out: 0,
                      entry: [true],
                      bearings: [353],
                      location: [
                        108.201265,
                        16.072431
                      ]
                    },
                    {
                      out: 0,
                      in: 2,
                      entry: [true, true, false, true],
                      bearings: [0, 75, 180, 255],
                      location: [
                        108.201221,
                        16.072765
                      ]
                    }
                  ],
                  weight: 8.4,
                  duration: 8.4,
                  distance: 81.7
                }
              ]
            }
          ]
        });
      }
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

