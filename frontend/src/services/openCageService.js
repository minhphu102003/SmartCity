import * as openCage from '../utils/openCageRequest';
import { OPENCAGE_KEY } from '../constants';

/**
 * 📍 Lấy địa chỉ từ tọa độ (latitude, longitude)
 * @param {number} latitude - Vĩ độ
 * @param {number} longitude - Kinh độ
 * @returns {Promise<string>} - Địa chỉ dưới dạng chuỗi hoặc thông báo lỗi
 */
export const fetchAddress = async (latitude, longitude) => {
  try {
    const response = await openCage.get('', {
      params: {
        q: `${latitude},${longitude}`,
        key: OPENCAGE_KEY,
      },
    });

    if (response.status === 200) {
      const results = response.data.results;
      if (results.length > 0) {
        return results[0].formatted; 
      }
      return 'No address found';
    } else {
      return 'Failed to fetch address';
    }
  } catch (error) {
    console.error('Error fetching address:', error);
    return 'Error fetching address';
  }
};
