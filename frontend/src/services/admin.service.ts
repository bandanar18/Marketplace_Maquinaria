import api from '@/lib/api';

export const adminService = {
  async getGlobalStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async exportData(entity: string) {
    const response = await api.get(`/admin/export/${entity}`);
    const { csv } = response.data;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_${entity}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
