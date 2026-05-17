import { api } from "@/lib/api";
import { UpdateUserRequest } from "@/types";

export const userService = {
    update: (data: UpdateUserRequest) =>
        api.put<void>("/users/me", data),
    
    getById: (id: number | string) =>
        api.get<any>(`/users/id/${id}`)
}