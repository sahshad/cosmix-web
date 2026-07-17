import { User } from "./user";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  user: Partial<User>;
}

export type MeResponse = {
  user: Partial<User>;
}

export type RefreshResponse = {
  access_token: string;
}

export type SignupRequest = {
  display_name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  email: string;
  role: string;
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
  new_password: string;
};

export type ResetPasswordResponse = {
  message: string;
};
