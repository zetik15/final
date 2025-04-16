import api from './index';

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/users', userData),
  getCurrentUser: (userId) => api.get(`/users/${userId}`),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  logout: () => {
    return Promise.resolve();
  }
}