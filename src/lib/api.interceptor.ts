// import { api } from './api';
// import { useAuthStore } from '@/store/auth.store';

// api.interceptors.request.use(
//   (config) => {
//     const token = useAuthStore.getState().token;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;

//     // 401 – unauthorized
//     if (status === 401) {
//       useAuthStore.getState().logout();

//       if (typeof window !== 'undefined') {
//         window.location.href = '/login';
//       }
//     }

//     // 403 – forbidden
//     if (status === 403) {
//       console.error('Forbidden');
//     }

//     // Global error fallback
//     return Promise.reject(error);
//   }
// );

import { authService } from '@/services/auth.service';
import { api } from './api';
import { useAuthStore } from '@/store/auth.store';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request if a refresh is already in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response: any = await authService.refresh();
        const newToken = response.data.access_token;
        useAuthStore.getState().setToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) {
      console.error('Forbidden');
    }

    return Promise.reject(error);
  }
);