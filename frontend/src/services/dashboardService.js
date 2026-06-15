import axiosInstance from './axiosInstance';

export const dashboardService = {
  async getDashboard() {
    const response = await axiosInstance.get('/dashboard');
    return response.data;
  },
};