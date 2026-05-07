import api from '@/lib/api';

export const productsService = {
  async getProducts(params?: any) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  async getProductsByCompany(companySlug: string, params?: any) {
    const response = await api.get(`/companies/${companySlug}/products`, { params });
    return response.data;
  },

  async getCompany(slug: string) {
    const response = await api.get(`/companies/${slug}`);
    return response.data;
  },

  async getProductBySlug(slug: string) {
    const response = await api.get(`/products/${slug}`);
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  },

  async createCategory(data: any) {
    const response = await api.post('/categories', data);
    return response.data;
  },

  async updateCategory(id: string, data: any) {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: string) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  async getProductById(id: string) {
    const response = await api.get(`/products/detail/${id}`);
    return response.data;
  },

  async updateProduct(id: string, data: any) {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
  },

  async createProduct(data: any) {
    const response = await api.post('/products', data);
    return response.data;
  },

  async boostProduct(id: string) {
    const response = await api.patch(`/products/${id}/boost`);
    return response.data;
  },

  // --- Admin Endpoints ---
  async getAdminProducts(params?: Record<string, any>) {
    const response = await api.get('/products/admin/list', { params });
    return response.data;
  },

  async updateProductStatus(id: string, status: string, rejectionReason?: string) {
    const response = await api.patch(`/products/${id}/status`, { status, rejectionReason });
    return response.data;
  },
};

export const quotesService = {
  async createQuote(data: { productId: string; message: string; quantity: number }) {
    const response = await api.post('/quotes', data);
    return response.data;
  },

  async getMyQuotes() {
    const response = await api.get('/quotes/my');
    return response.data;
  },
  
  async getQuoteById(id: string) {
    const response = await api.get(`/quotes/${id}`);
    return response.data;
  },

  async respondToQuote(id: string, data: { message: string, status: 'ACCEPTED' | 'REJECTED', price?: number }) {
    const response = await api.patch(`/quotes/${id}/respond`, data);
    return response.data;
  }
};
