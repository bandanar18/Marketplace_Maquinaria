import api from '@/lib/api';

export const reportService = {
  async getReports(params?: Record<string, any>) {
    const response = await api.get('/reports', { params });
    return response.data;
  },

  async deleteReport(id: string) {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },
};
