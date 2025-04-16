import api from './index';

export const usersAPI = {
  getUsers: () => api.get('/users')
}