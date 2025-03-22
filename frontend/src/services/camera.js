import * as request from '../utils/request';
import { CAMERA_ENDPOINT } from '../constants';
/**
 * @param {Object} params - Optional query parameters.
 * @param {number} [params.latitude] - Latitude of the location.
 * @param {number} [params.longitude] - Longitude of the location.
 * @param {number} [params.page=1] - Page number for pagination.
 * @param {number} [params.limit=10] - Number of results per page.
 * @param {number} [params.distance] - Search radius in km.
 * @returns {Promise<Object>} - The response data from the API.
 */
export const getCameras = async (params = {}) => {
  try {
    const response = await request.get(CAMERA_ENDPOINT, { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching cameras:', error);
    throw error;
  }
};
