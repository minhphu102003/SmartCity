import * as goongMap from '../utils/goongMapRequest';
import {
  PLACE_AUTO_COMPLETE_ENDPOINT,
  GOONG_MAP_KEY,
  PLACE_DETAIL_ENDPOINT,
} from '../constants';

export const getGoongMapSuggestions = async (query, latitude, longitude) => {
  try {
    const response = await goongMap.get(PLACE_AUTO_COMPLETE_ENDPOINT, {
      params: {
        api_key: GOONG_MAP_KEY,
        location: `${latitude},${longitude}`,
        input: query,
      },
    });

    if (response.status === 200) {
      console.log(response.data);
      const predictions = response.data.predictions || [];
      return predictions.map((item) => ({
        description: item.description,
        place_id: item.place_id,
      }));
    } else {
      console.error('Failed to fetch data from Goong Map:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching Goong Map data:', error);
    return [];
  }
};

/**
 * Lấy tọa độ từ Place ID bằng Goong Map API
 * @param {string} placeId - ID của địa điểm
 * @returns {Promise<{ lat: number, lng: number } | null>}
 */

export const getPlaceCoordinates = async (placeId) => {
  try {
    const response = await goongMap.get(PLACE_DETAIL_ENDPOINT, {
      params: {
        api_key: GOONG_MAP_KEY,
        place_id: placeId,
      },
    });

    if (response.status === 200) {
      console.log(response.data);
      const result = response.data.result;
      if (result && result.geometry) {
        const location = result.geometry.location;
        return { lat: location.lat, lng: location.lng };
      }
    } else {
      console.error('Failed to fetch place details:', response.status);
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
  }
  return null;
};
