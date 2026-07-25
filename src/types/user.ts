export type User = {
  id: string;
  displayName: string;
  username: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  isPrivate: boolean;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  website?: string;
  location?: string;
  dateOfBirth: string;
  lastSeenAt?: string;
  createdAt: string;
  updatedAt: string;
};

