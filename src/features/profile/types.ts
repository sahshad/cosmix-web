import { User } from "@/types/user";

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
  user: User;
};

export type UserListResponse = {
  users: User[];
};
