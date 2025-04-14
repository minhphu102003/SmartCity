import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export const reportService = {
  // Get all reports
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

  // Create a new report
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

  // Submit a report about a post
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