import { api } from '@/lib/api';
import { CreatePostRequest, PostResponse } from '@/types/post';

export const postService = {
  createPost: (data: CreatePostRequest) =>
    api.post<PostResponse>('/posts', data),

  getFeed: (page: number = 1, limit: number = 20) =>
    api.get<any>(`/posts?page=${page}&limit=${limit}`),

  likePost: (id: number | string) =>
    api.post<any>(`/posts/${id}/like`),

  unlikePost: (id: number | string) =>
    api.delete<any>(`/posts/${id}/like`),

  createComment: (id: number | string, content: string) =>
    api.post<any>(`/posts/${id}/comment`, { content }),
};
