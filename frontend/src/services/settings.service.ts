import api from '@/lib/api';

export const settingsService = {
  async getSettings() {
    const response = await api.get('/settings');
    return response.data;
  },

  async updateSettings(configs: Record<string, string>) {
    const response = await api.patch('/settings', configs);
    return response.data;
  },
};
