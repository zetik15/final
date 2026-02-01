import axios from 'axios';
import { get, remove } from '../utils/localStorage';

const api = axios.create({
  baseURL: 'https://event-organizer-2ygk.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
    const token = get('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use((response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      remove('token');
    }
    
    return Promise.reject(error);
  }
);

export default api;