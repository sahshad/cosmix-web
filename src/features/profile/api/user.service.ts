import { http } from "@/lib/http";
import { UpdateProfileRequest, UserProfileResponse, UserListResponse, MessageResponse } from "../types";

export const userService = {
  updateProfile: (data: UpdateProfileRequest) =>
    http.put<UserProfileResponse>("/users/me", data),

  getByUsername: (username: string) =>
    http.get<UserProfileResponse>(`/users/username/${username}`),

  getFollowers: (userId: string) =>
    http.get<UserListResponse>(`/users/followers/${userId}`),

  getFollowing: (userId: string) =>
    http.get<UserListResponse>(`/users/following/${userId}`),

  followUser: (userId: string) =>
    http.post<MessageResponse>(`/users/follow/${userId}`),

  unfollowUser: (userId: string) =>
    http.delete<MessageResponse>(`/users/unfollow/${userId}`),
};
