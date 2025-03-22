import * as request from '../utils/request';
import { WEATHER_SUGGET_ENDPOINT } from '../constants';

export const getSugget = async (latitude, longitude) =>{
    try{
        const response = await request.get(WEATHER_SUGGET_ENDPOINT, {
            params: { latitude, longitude },
        });
        return response.data; 
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu gợi ý:', error);
      throw error;
    }
}