import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { LoginRequest, LoginResponse, SignupRequest, User } from "@/types";
import { useAuthStore } from "@/store/auth.store";

export function useLogin() {

  const setUser = useAuthStore((s) => s.setUser);
  const setIsAuthenticated = useAuthStore((s) => s.setIsAuthenticated);
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: async (request: LoginRequest) => {
      const response = await authService.login(request);
      return response.data;
    },
    onSuccess: (response: LoginResponse) => {
      setUser(response.user);
      setIsAuthenticated(true);
      setToken(response.access_token);
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (data: SignupRequest) =>
      authService.signup(data),
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authService.me(),
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