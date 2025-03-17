import { getNearestPlaces } from '../services/place';

export const getPlace = async (longitude, latitude, type) => {
    try {
        const response = await getNearestPlaces(longitude, latitude, 10, type); 
        console.log("API Response:", response?.data); 
        return response?.data?.data ?? []; 
    } catch (error) {
        console.error("Error fetching places:", error); 
        return [];
    }
};
