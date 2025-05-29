import * as request from '../utils/request';
import { REPORT_ENDPOINT } from '../constants';

export const getAccountReport = async (params = {}) => {
  try {
    const response = await request.get(REPORT_ENDPOINT, { params });

    return response?.data;
    }catch(error){
        return { data: { data: [] } };
    }
};

export const getRecentReports = async () => {
    try{
        const now = new Date();
        const tenMinutesAgo = new Date(now.getTime() - 10 * 60000 );
        const params = {
            startDate: tenMinutesAgo.toISOString(),
            limit: 50,
            analysisStatus: true
        }
        const response = await request.get(REPORT_ENDPOINT, {
            params,
        });
        return response?.data;
    }catch(error){
        return { data: { data: [] } };
    }
}