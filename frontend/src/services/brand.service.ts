import api from '@/lib/api';

export const brandService = {
  async getBrands() {
    const response = await api.get('/brands');
    return response.data;
  },

  async createBrand(data: { name: string; logoUrl?: string }) {
    const response = await api.post('/brands', data);
    return response.data;
  },

  async updateBrand(id: string, data: { name?: string; logoUrl?: string }) {
    const response = await api.patch(`/brands/${id}`, data);
    return response.data;
  },

  async deleteBrand(id: string) {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  },
};
