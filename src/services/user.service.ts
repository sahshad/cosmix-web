import { api } from "@/lib/api";
import { UpdateUserRequest } from "@/types";

export const userService = {
    update: (data: UpdateUserRequest) =>
        api.put<void>("/user/me", data)
}