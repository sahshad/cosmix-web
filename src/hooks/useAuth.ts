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
    mutationFn: async (data: LoginRequest) => {
      const response = await authService.login(data);
      return response.data;
    },
    onSuccess: (data: LoginResponse) => {
      setUser(data.user);
      setIsAuthenticated(true);
      setToken(data.access_token);
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (data: SignupRequest) =>
      authService.signup(data),
  });
}

// export function useMe() {
//   const setUser = useAuthStore((s) => s.setUser);
//   const setIsAuthenticated = useAuthStore((s) => s.setIsAuthenticated);
//   const logout = useAuthStore((s) => s.logout);

//   const query = useQuery<User, Error>({
//     queryKey: ["me"],
//     queryFn: async () => {
//       const response = await authService.me();
//       return response.data;
//     },
//   });

//   useEffect(() => {
//     if (query.isSuccess && query.data) {
//       setUser(query.data);
//       setIsAuthenticated(true);
//     }
//   }, [query.isSuccess, query.data, setUser, setIsAuthenticated]);

//   useEffect(() => {
//     if (query.isError) {
//       logout();
//     }
//   }, [query.isError, logout]);

//   return query;
// }

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