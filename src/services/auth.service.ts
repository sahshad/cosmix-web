import { api } from '@/lib/api';
import {
  SignupRequest,
  LoginRequest,
  MeResponse,
  LoginResponse,
  RefreshResponse
} from '@/types';

export const authService = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data),

  me: () =>
    api.get<MeResponse>('/users/me'),

  logout: () =>
    api.post('/auth/logout'),

  signup: (data: SignupRequest) =>
    api.post('/auth/register', data),

  refresh: () =>
    api.get<RefreshResponse>('/auth/refresh'),
};
