import { api } from '@/lib/api';
import {
  CreatePostRequest,
  GetCommentResponse,
  GetCommentsResponse,
  GetPostResponse,
  GetPostsResponse,
  MediaItem,
  MessageResponse,
} from '@/types/post';

export const postService = {
  createPost: (data: CreatePostRequest) =>
    api.post<GetPostResponse>('/posts', data),

  getFeed: (page: number = 1, limit: number = 20) =>
    api.get<GetPostsResponse>(`/posts?page=${page}&limit=${limit}`),

  getUserPosts: (userId: string, page: number = 1, limit: number = 20) =>
    api.get<GetPostsResponse>(`/posts/user/${userId}?page=${page}&limit=${limit}`),

  updatePost: (id: number | string, content: string, media?: MediaItem[]) =>
    api.put<GetPostResponse>(`/posts/${id}`, { content, media }),

  likePost: (id: number | string) =>
    api.post<MessageResponse>(`/posts/${id}/like`),

  unlikePost: (id: number | string) =>
    api.delete<MessageResponse>(`/posts/${id}/like`),

  createComment: (id: number | string, content: string, parentCommentId?: string) =>
    api.post<GetCommentResponse>(`/posts/${id}/comment`, { content, parentCommentId }),

  getComments: (id: number | string, page: number = 1, limit: number = 4) =>
    api.get<GetCommentsResponse>(`/posts/${id}/comment?page=${page}&limit=${limit}`),

  getReplies: (commentId: string, page: number = 1, limit: number = 20) =>
    api.get<GetCommentsResponse>(`/posts/comment/${commentId}/replies?page=${page}&limit=${limit}`),

  likeComment: (commentId: string) =>
    api.post<MessageResponse>(`/posts/comment/${commentId}/like`),

  unlikeComment: (commentId: string) =>
    api.delete<MessageResponse>(`/posts/comment/${commentId}/like`),

  updateComment: (commentId: string, content: string) =>
    api.put<GetCommentResponse>(`/posts/comment/${commentId}`, { content }),

  deleteComment: (commentId: string) =>
    api.delete<MessageResponse>(`/posts/comment/${commentId}`),

  deletePost: (id: number | string) =>
    api.delete<MessageResponse>(`/posts/${id}`),
};
