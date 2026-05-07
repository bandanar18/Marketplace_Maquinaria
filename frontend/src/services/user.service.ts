import api from '@/lib/api';

export const userService = {
  async getProfile() {
    const response = await api.get('/users/me');
    return response.data;
  },

  async updateProfile(data: any) {
    const response = await api.patch('/users/me', data);
    return response.data;
  },

  // --- Admin Endpoints ---
  async getAdminUsers(params?: Record<string, any>) {
    const response = await api.get('/users/admin/list', { params });
    return response.data;
  },

  async updateUserStatus(id: string, status: string) {
    const response = await api.patch(`/users/${id}/status`, { status });
    return response.data;
  },
};
