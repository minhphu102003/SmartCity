import axios from 'axios';

const API_URL = 'https://danahub-backend-4ccd2faffe40.herokuapp.com/api/v1';

export const reportService = {
  getAllReports: async () => {
    try {
      const response = await axios.get(`${API_URL}/account-report`);
      console.log('API Response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  createReport: async (reportData) => {
    try {
      const formData = new FormData();
      formData.append('description', reportData.description);
      formData.append('typeReport', reportData.typeReport || 'TRAFFIC_JAM');
      formData.append('congestionLevel', reportData.congestionLevel || 'POSSIBLE_CONGESTION');
      formData.append('longitude', reportData.longitude);
      formData.append('latitude', reportData.latitude);
      
      if (reportData.images && reportData.images.length > 0) {
        reportData.images.forEach((image) => {
          formData.append('imgs', image);
        });
      }

      const response = await axios.post(`${API_URL}/account-report`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  submitReport: async (reportData) => {
    try {
      const response = await axios.post(`${API_URL}/account-report/report`, reportData);
      return response.data;
    } catch (error) {
      console.error('Error submitting report:', error);
      throw error;
    }
  }
}; 