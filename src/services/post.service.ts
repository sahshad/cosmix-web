import { api } from '@/lib/api';
import { CreatePostRequest } from '@/types/post';

export const postService = {
  createPost: (data: CreatePostRequest) =>
    api.post<any>('/posts', data),

  getFeed: (page: number = 1, limit: number = 20) =>
    api.get<any>(`/posts?page=${page}&limit=${limit}`),

  getUserPosts: (userId: string, page: number = 1, limit: number = 20) =>
    api.get<any>(`/posts/user/${userId}?page=${page}&limit=${limit}`),

  updatePost: (id: number | string, content: string) =>
    api.put<any>(`/posts/${id}`, { content }),

  likePost: (id: number | string) =>
    api.post<any>(`/posts/${id}/like`),

  unlikePost: (id: number | string) =>
    api.delete<any>(`/posts/${id}/like`),

  createComment: (id: number | string, content: string, parentCommentId?: string) =>
    api.post<any>(`/posts/${id}/comment`, { content, parentCommentId }),

  getComments: (id: number | string, page: number = 1, limit: number = 4) =>
    api.get<any>(`/posts/${id}/comment?page=${page}&limit=${limit}`),

  getReplies: (commentId: string, page: number = 1, limit: number = 20) =>
    api.get<any>(`/posts/comment/${commentId}/replies?page=${page}&limit=${limit}`),

  likeComment: (commentId: string) =>
    api.post<any>(`/posts/comment/${commentId}/like`),

  unlikeComment: (commentId: string) =>
    api.delete<any>(`/posts/comment/${commentId}/like`),

  updateComment: (commentId: string, content: string) =>
    api.put<any>(`/posts/comment/${commentId}`, { content }),

  deleteComment: (commentId: string) =>
    api.delete<any>(`/posts/comment/${commentId}`),

  deletePost: (id: number | string) =>
    api.delete<any>(`/posts/${id}`),
};
