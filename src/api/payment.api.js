import api from './axios';

export const paymentAPI = {
  record: (data) => api.post('/payments', data),
  getByInvoice: (invoiceId) => api.get(`/payments/invoice/${invoiceId}`),
  getAll: (params) => api.get('/payments', { params }),
};
