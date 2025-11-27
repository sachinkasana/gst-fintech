import api from './axios';

export const reportAPI = {
  getSalesRegister: (params) => 
    api.get('/reports/sales-register', { params, responseType: 'blob' }),
  getGSTR1: (params) => 
    api.get('/reports/gstr1', { params, responseType: 'blob' }),
  getTaxSummary: (params) => 
    api.get('/reports/tax-summary', { params, responseType: 'blob' }),
};
