import * as requests from '../utils/request';
import { ROUTE_ENDPOINT } from '../constants';

/**
 * Gọi API để lấy danh sách tuyến đường từ backend
 * @param {string} start - Tọa độ điểm bắt đầu (latitude, longitude)
 * @param {string} end - Tọa độ điểm kết thúc (latitude, longitude)
 * @param {string} vehicleType - Loại phương tiện (mặc định là "drive")
 * @returns {Promise<Object>} - Trả về danh sách tuyến đường từ backend
 */

export const fetchRoutes = async (start, end, vehicleType = 'drive') => {
  try {
    const response = await requests.get(ROUTE_ENDPOINT, {
      params: { start, end, vehicleType },
    });

    return response;
  } catch (error) {
    console.error('Lỗi khi lấy tuyến đường:', error);
    throw error;
  }
};
