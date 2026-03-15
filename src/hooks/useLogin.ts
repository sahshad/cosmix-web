import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { LoginRequest } from "@/types";

export function useLogin() {
    return useMutation({
        mutationFn: (data: LoginRequest) =>
            authService.login(data),
    })
}