import api from '@/lib/api';

export const favoritesService = {
  async getMyFavorites() {
    const response = await api.get('/favorites/my');
    return response.data;
  },

  async toggleFavorite(productId: string) {
    const response = await api.post(`/favorites/${productId}`);
    return response.data;
  },

  async isFavorited(productId: string) {
    const response = await api.get(`/favorites/${productId}/check`);
    return response.data;
  }
};
