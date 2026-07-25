import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../api/auth.service";
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types";
import { useAuthStore } from "../store";

export function useLogin() {
  // const setUser = useAuthStore((s) => s.setUser);
  const setIsAuthenticated = useAuthStore((s) => s.setIsAuthenticated);
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: async (request: LoginRequest) => {
      const response = await authService.login(request);
      return response;
    },
    onSuccess: (response: LoginResponse) => {
      // setUser(response.user);
      setIsAuthenticated(true);
      setToken(response.accessToken);
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (data: SignupRequest) => authService.signup(data),
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authService.me(),
    select: (data) => data.user,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => authService.verifyEmail(data),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) =>
      authService.resetPassword(data),
  });
}
