export type User = {
  id: string;
  displayName: string;
  username: string;
  email: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isVerified: boolean;
  avatarUrl: string;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserRequest = {
  displayName?: string;
  username?: string;
  email?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  isVerified?: boolean;
  avatarUrl?: string;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
};
