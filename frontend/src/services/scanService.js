import axiosInstance from './axiosInstance';

export const scanService = {
  async getScan() {
    const response = await axiosInstance.get('/scan');
    return response.data;
  },

  async runScan() {
    const response = await axiosInstance.post('/scan');
    return response.data;
  },
};