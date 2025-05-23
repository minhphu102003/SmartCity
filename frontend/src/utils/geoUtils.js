import * as turf from "@turf/turf";

/**
 * Generate a GeoJSON circle around a point
 * @param {number} longitude - The longitude of the center
 * @param {number} latitude - The latitude of the center
 * @param {number} radiusInKm - Radius in kilometers (default: 0.1)
 * @returns {GeoJSON.Feature<GeoJSON.Polygon>} A GeoJSON polygon circle
 */
export const getCircleGeoJSON = (longitude, latitude, radiusInKm = 0.1) => {
  const center = turf.point([longitude, latitude]);
  const options = { steps: 64, units: "kilometers" };
  return turf.circle(center, radiusInKm, options);
};