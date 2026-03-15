import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { SignupRequest } from '@/types';

export function useSignup() {
    return useMutation({
        mutationFn: (data: SignupRequest) =>
            authService.signup(data),
    });
}
