import api from '@/lib/api';

export const auditService = {
  async getLogs(params?: Record<string, any>) {
    const response = await api.get('/audit/logs', { params });
    return response.data;
  },
};
