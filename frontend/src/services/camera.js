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


/**
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export const deleteCamera = async (id) => {
  try {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const token = authData?.token;

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await request.deleteRe(`${CAMERA_ENDPOINT}/${id}`, {
      headers: {
        'x-access-token': token,
      },
    });

    return response?.data;
  } catch (error) {
    console.error(`Error deleting camera with id ${id}:`, error);
    throw error;
  }
};

/**
 * @param {Object} cameraData 
 * @param {number} cameraData.Latitude
 * @param {number} cameraData.longitude 
 * @param {string} cameraData.link 
 * @param {boolean} [cameraData.status=true]
 * @param {string} [cameraData.installation_date]
 * @param {string} [cameraData.roadSegment_id]
 * @returns {Promise<Object>} 
 */
export const createCamera = async (cameraData) => {
  try {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const token = authData?.token;

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await request.post(CAMERA_ENDPOINT, cameraData, {
      headers: {
        'x-access-token': token,
      },
    });

    return response?.data;
  } catch (error) {
    console.error('Error creating camera:', error);
    throw error;
  }
};


/**
 * @param {string} id
 * @param {Object} updateData 
 * @param {number} [updateData.latitude]
 * @param {number} [updateData.longitude]
 * @param {boolean} [updateData.status]
 * @param {string} [updateData.installation_date]
 * @param {string[]} [updateData.roadSegment_ids]
 * @returns {Promise<Object>} 
 */
export const updateCamera = async (id, updateData) => {
  try {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const token = authData?.token;

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await request.put(`${CAMERA_ENDPOINT}/${id}`, updateData, {
      headers: {
        'x-access-token': token,
      },
    });

    return response?.data;
  } catch (error) {
    console.error('Error updating camera:', error);
    throw error;
  }
};