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
  followersCount: number;
  followingCount: number;
  /** Whether the current authenticated user follows this user. Only set on single-user lookups (e.g. by username). */
  isFollowing?: boolean;
  createdAt: string;
  updatedAt: string;
};

