import api from '@/lib/api';

export const supportService = {
  // Tickets
  async getTickets() {
    const response = await api.get('/support/tickets');
    return response.data;
  },

  async updateTicketStatus(id: string, status: string) {
    const response = await api.patch(`/support/tickets/${id}/status`, { status });
    return response.data;
  },

  // Broadcasts
  async getBroadcasts() {
    const response = await api.get('/support/broadcasts');
    return response.data;
  },

  async createBroadcast(data: { title: string; message: string; target: string }) {
    const response = await api.post('/support/broadcasts', data);
    return response.data;
  },
};
