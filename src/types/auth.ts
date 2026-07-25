import { User } from "./user";

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthUser = {
  email: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
}

export type MeResponse = {
  user: User;
}

export type RefreshResponse = {
  accessToken: string;
}

export type SignupRequest = {
  displayName: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  userId: string;
};

export type LogoutResponse = {
  message: string;
};

export type VerifyEmailRequest = {
  token: string;
  email: string;
  password: string;
};

export type VerifyEmailResponse = {
  message: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type ResetPasswordResponse = {
  message: string;
};
