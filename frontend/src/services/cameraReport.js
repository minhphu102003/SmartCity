import * as request from '../utils/request';
import { CAMERA_REPORT_ENDPOINT } from '../constants';

export const getCameraReport = async (page = 1, limit=50) =>{
    try{
        const params = {
            page,
            limit
        }
        const response = await request.get(CAMERA_REPORT_ENDPOINT, {
            params
        });
        return response?.data;
    }catch{
        return { data: { data: [] } };
    }
}