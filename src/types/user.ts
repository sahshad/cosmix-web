export type User = {
  id: string;
  displayName: string;
  username: string;
  email: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isVerified: boolean;
  isPrivate?: boolean;
  avatarUrl: string;
  coverImageUrl?: string;
  bio?: string;
  website?: string;
  location?: string;
  dateOfBirth?: string;
  lastLoginAt: string;
  lastSeenAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileRequest = {
  displayName?: string;
  username?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  website?: string;
  location?: string;
};

export type UserProfileResponse = {
  user: Partial<User>;
};

export type UserListResponse = {
  users: Partial<User>[];
};
