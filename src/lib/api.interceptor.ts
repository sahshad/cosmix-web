import { api } from './api';
import { useAuthStore } from '@/store/auth.store';

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 401 – unauthorized
    if (status === 401) {
      useAuthStore.getState().logout();

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // 403 – forbidden
    if (status === 403) {
      console.error('Forbidden');
    }

    // Global error fallback
    return Promise.reject(error);
  }
);
