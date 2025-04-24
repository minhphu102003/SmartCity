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
      type, 
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
  name ='',
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
      params,
    });

    return response?.data;
  } catch (error) {
    return error;
  }
};
 