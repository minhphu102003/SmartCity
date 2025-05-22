import * as request from '../utils/request';
import { ROAD_SEGMENT_ENDPOINT } from '../constants';

export const getRoadSegments = async (params = {}) =>{
  try{
    const response = await request.get(ROAD_SEGMENT_ENDPOINT, {params});
    return response?.data;
  }catch(error){
    console.error('Error fetching road segments:', error);
    throw error;
  }
}

export const updateRoadSegment = async(id, updateData) => {
  try{
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const token = authData?.token;

    if (!token){
      throw new Error("No authentication token found");      
    }

    const response = await request.put(`${ROAD_SEGMENT_ENDPOINT}/${id}`, updateData, 
      {
        headers:{
          'x-access-token': token,
        }
      }
    )
    
    return response?.data;
  }catch(error){
    console.error('Error updating road segment:', error);
    throw error;
  }
}