import * as request from '../utils/request'

const PLACES_NEAREST_ENDPOINT = '/place/nearest';

export const getNearestPlaces = async (accessToken, lat, lng, radius= 10, type = null, limit = 20, page = 1, minStar = null, maxStar = null) => {
    try{
        const params = {
            latitude: lat,
            longitude: lng,
            radius,
            type,
            page,
            minStar,
            maxStar,
        };

        const response = await request.get(PLACES_NEAREST_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params,
        });
        return response.data;
    }catch (error){
        return error;
    }
}

const PLACE_SEARCH_ENDPOINT = '/place/search';

export const searchPlaceByName = async (accessToken, name, limit = 10, page = 1) => {
    try{
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
        
        return response.data;
    } catch (error){
        return error;
    }
}
