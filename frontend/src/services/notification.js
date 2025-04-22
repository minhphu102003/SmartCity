import * as request from '../utils/request';
import { NOTIFICATION_ENDPOINT } from '../constants';

/**
 * @param {Object} params
 * @returns {Promise<Object>} 
 */
export const getNotifications = async (params = {}) => {
  try {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const token = authData?.token;

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await request.get(NOTIFICATION_ENDPOINT, {
      params,
      headers: {
        'x-access-token': token,
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

/**
 * @param {Object} data 
 * @param {string} data.message 
 * @param {number} data.latitude 
 * @param {number} data.longitude 
 * @param {string} [data.img]
 * @returns {Promise<Object>}
 */
export const createNotification = async (data) => {
  try {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const token = authData?.token;

    const formData = new FormData();
    formData.append("message", data.message);
    formData.append("latitude", data.latitude);
    formData.append("longitude", data.longitude);
    if (data.img) {
      console.log('true');
      formData.append("img", data.img);
    }
    console.log(formData);
    const response = await request.post(NOTIFICATION_ENDPOINT, formData, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response?.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * @param {string} id 
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateNotification = async (id, data) => {
  try {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const token = authData?.token;

    const response = await request.put(`${NOTIFICATION_ENDPOINT}/${id}`, data, {
      headers: {
        'x-access-token': token, 
      }
    });
    return response?.data;
  } catch (error) {
    console.error('Error updating notification:', error);
    throw error;
  }
};

/**
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export const deleteNotification = async (id) => {
  try {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const token = authData?.token;

    const response = await request.deleteRe(`${NOTIFICATION_ENDPOINT}/${id}`, {
      headers: {
        'x-access-token': token, 
      }
    });
    return response?.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};