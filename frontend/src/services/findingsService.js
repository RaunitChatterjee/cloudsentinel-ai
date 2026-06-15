import axiosInstance from './axiosInstance';

export const findingsService = {
  async getScan() {
    const response = await axiosInstance.get('/scan');
    return response.data;
  },
};