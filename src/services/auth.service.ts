import {
  SignupRequest,
  LoginRequest,
  MeResponse,
  LoginResponse,
  RefreshResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/types";
import { http } from "@/lib/http";

export const authService = {
  login: (data: LoginRequest) => 
    http.post<LoginResponse>("/auth/login", data),

  me: () => 
    http.get<MeResponse>("/users/me"),

  logout: () => 
    http.post("/auth/logout"),

  signup: (data: SignupRequest) => 
    http.post("/auth/register", data),

  refresh: () => 
    http.get<RefreshResponse>("/auth/refresh"),

  verifyEmail: (data: VerifyEmailRequest) =>
    http.post<VerifyEmailResponse>("/auth/verify-email", data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    http.post<ForgotPasswordResponse>("/auth/forgot-password", data),

  resetPassword: (data: ResetPasswordRequest) =>
    http.post<ResetPasswordResponse>("/auth/reset-password", data),
};
