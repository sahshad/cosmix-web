import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
