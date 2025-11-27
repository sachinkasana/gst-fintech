import api from './axios';

export const businessAPI = {
  get: () => api.get('/business'),
  update: (data) => api.put('/business', data),
  getInvoiceSettings: () => api.get('/business/invoice-settings'),
};
