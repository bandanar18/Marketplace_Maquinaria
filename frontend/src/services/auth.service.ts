import api from '@/lib/api';

export const authService = {
  async login(data: any) {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async registerClient(data: any) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async registerCompany(data: any) {
    const response = await api.post('/auth/register/company', data);
    return response.data;
  },

  async getMe() {
    const response = await api.get('/users/me');
    return response.data;
  },

  async updateMe(data: any) {
    const response = await api.patch('/users/me', data);
    return response.data;
  }
};
