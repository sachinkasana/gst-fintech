import api from './axios';

export const invoiceAPI = {
  getAll: (params) => api.get('/invoices', { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  getDashboardStats: () => api.get('/invoices/stats/dashboard'),
  downloadPdf: (id) =>
    api.get(`/invoices/${id}/pdf`, {
      responseType: 'blob',
    }),
  getTemplates: () => api.get('/invoices/templates'),
};
