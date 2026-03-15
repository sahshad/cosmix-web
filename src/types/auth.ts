export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  email: string;
  role: string;
};
