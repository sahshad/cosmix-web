export type User = {
  id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  is_active: boolean;
  email_verified: boolean;
  last_login_at: string;
  created_at: string;
  updated_at: string;
};

export type UpdateUserRequest = {
  first_name?: string;
  last_name?: string;
  user_name?: string;
  email?: string;
  is_active?: boolean;
  email_verified?: boolean;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
};
