import * as request from '../utils/requestV2';
import { REVIEW_REPORT_ENDPOINT } from '../constants';

/**
 * Update account report review by ID
 * @param {string} id - Review ID
 * @param {Object} data - Dữ liệu update, ví dụ { reason, status }
 * @returns {Promise<Object>} - Trả về data của response
 */


export const updateAccountReportReview = async (id, data) => {
  try {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const token = authData?.token;

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await request.put(
      `${REVIEW_REPORT_ENDPOINT}/${id}`,
      data,
      {
        headers: {
          'x-access-token': token,
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.error('Error updating account report review:', error);
    throw error;
  }
};