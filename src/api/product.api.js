import api from './axios';

export const productAPI = {
  search: (query) => api.get('/products/search', { params: { q: query } }),
  getAll: (params) => api.get('/products', { params }),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};
