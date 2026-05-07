import api from '@/lib/api';

export const companyService = {
  // ─── Authenticated (vendor) endpoints ───────────────────────────────────────
  async getMyCompany() {
    const response = await api.get('/companies/me');
    return response.data;
  },

  async updateMyCompany(data: any) {
    const response = await api.patch('/companies/me', data);
    return response.data;
  },

  async getCompanyStats() {
    const response = await api.get('/companies/stats');
    return response.data;
  },
  
  async getCompanyCustomers() {
    const response = await api.get('/companies/my/customers');
    return response.data;
  },

  async getCompanyMembers() {
    const response = await api.get('/companies/my/members');
    return response.data;
  },

  async getCompanyInvites() {
    const response = await api.get('/companies/my/invites');
    return response.data;
  },

  async inviteMember(data: { email: string; role: string }) {
    const response = await api.post('/companies/my/invites', data);
    return response.data;
  },

  async cancelInvite(id: string) {
    const response = await api.patch(`/companies/my/invites/${id}/cancel`);
    return response.data;
  },

  async removeMember(id: string) {
    const response = await api.delete(`/companies/my/members/${id}`);
    return response.data;
  },

  async importInventory(csvData: string) {
    const response = await api.post('/companies/my/inventory/import', { csvData });
    return response.data;
  },

  // ─── Public storefront endpoints ────────────────────────────────────────────
  async getCompanies(params?: Record<string, any>) {
    const response = await api.get('/companies', { params });
    return response.data;
  },

  async getCompanyBySlug(slug: string) {
    const response = await api.get(`/companies/${slug}`);
    return response.data;
  },

  async getCompanyProducts(slug: string, params?: Record<string, any>) {
    const response = await api.get(`/companies/${slug}/products`, { params });
    return response.data;
  },

  // --- Admin Endpoints ---
  async getAdminCompanies(params?: Record<string, any>) {
    const response = await api.get('/companies/admin/list', { params });
    return response.data;
  },

  async updateCompanyStatus(id: string, status: string, rejectionReason?: string) {
    const response = await api.patch(`/companies/${id}/status`, { status, rejectionReason });
    return response.data;
  },
  async updateCompanyPlan(id: string, plan: string, expiresAt?: string) {
    const response = await api.patch(`/companies/${id}/plan`, { plan, expiresAt });
    return response.data;
  },
};
