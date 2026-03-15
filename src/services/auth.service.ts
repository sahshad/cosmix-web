import { api } from '@/lib/api';
import { SignupRequest, LoginRequest } from '@/types';

export const authService = {
  login: (data: LoginRequest) =>
    api.post('/auth/login', data),

  me: () =>
    api.get('/user/me'),

  logout: () =>
    api.post('/auth/logout'),

  signup: (data: SignupRequest) =>
    api.post('/auth/register', data),
};
