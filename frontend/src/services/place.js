import * as request from '../utils/request';
import { PLACES_NEAREST_ENDPOINT, PLACE_SEARCH_ENDPOINT } from '../constants';

export const getNearestPlaces = async (
  lat,
  lng,
  radius = 10,
  type = null,
  limit = 10,
  page = 1,
  minStar = null,
  maxStar = null
) => {
  try {
    const params = {
      latitude: lat,
      longitude: lng,
      radius,
      type,  // Đảm bảo type được truyền đúng
      page,
      limit,
      minStar,
      maxStar,
    };

    const response = await request.get(PLACES_NEAREST_ENDPOINT, { params });
    

    return response;
  } catch (error) {
    console.error("API Error:", error.response || error.message);
    return { data: { data: [] } };
  }
};

export const searchPlaceByName = async (
  accessToken,
  name,
  limit = 10,
  page = 1
) => {
  try {
    const params = {
      name,
      limit,
      page,
    };

    const response = await request.get(PLACE_SEARCH_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params,
    });

    return response;
  } catch (error) {
    return error;
  }
};
 