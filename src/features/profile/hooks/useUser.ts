import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService } from "../api/user.service";
import { UpdateProfileRequest } from "../types";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useFollowers(userId?: string) {
  return useQuery({
    queryKey: ["followers", userId],
    queryFn: () => userService.getFollowers(userId as string),
    select: (data) => data.users,
    enabled: !!userId,
  });
}

export function useFollowing(userId?: string) {
  return useQuery({
    queryKey: ["following", userId],
    queryFn: () => userService.getFollowing(userId as string),
    select: (data) => data.users,
    enabled: !!userId,
  });
}

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isFollowing }: { userId: string; isFollowing: boolean }) => {
      if (isFollowing) {
        await userService.unfollowUser(userId);
      } else {
        await userService.followUser(userId);
      }
      return { userId, isFollowing: !isFollowing };
    },
    onSuccess: ({ userId }) => {
      queryClient.invalidateQueries({ queryKey: ["followers", userId] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
    onError: () => {
      toast.error("Failed to update follow status");
    },
  });
}
