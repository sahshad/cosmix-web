import { http } from '@/lib/http';
import {
  CreatePostRequest,
  GetCommentResponse,
  GetCommentsResponse,
  GetPostResponse,
  GetPostsResponse,
  MediaItem,
  MessageResponse,
} from '../types';

export const postService = {
  createPost: (data: CreatePostRequest) =>
    http.post<GetPostResponse>('/posts', data),

  getFeed: (page: number = 1, limit: number = 20) =>
    http.get<GetPostsResponse>(`/posts?page=${page}&limit=${limit}`),

  getUserPosts: (userId: string, page: number = 1, limit: number = 20) =>
    http.get<GetPostsResponse>(`/posts/user/${userId}?page=${page}&limit=${limit}`),

  updatePost: (id: number | string, content: string, media?: MediaItem[]) =>
    http.put<GetPostResponse>(`/posts/${id}`, { content, media }),

  likePost: (id: number | string) =>
    http.post<MessageResponse>(`/posts/${id}/like`),

  unlikePost: (id: number | string) =>
    http.delete<MessageResponse>(`/posts/${id}/like`),

  createComment: (id: number | string, content: string, parentCommentId?: string) =>
    http.post<GetCommentResponse>(`/posts/${id}/comment`, { content, parentCommentId }),

  getComments: (id: number | string, page: number = 1, limit: number = 4) =>
    http.get<GetCommentsResponse>(`/posts/${id}/comment?page=${page}&limit=${limit}`),

  getReplies: (commentId: string, page: number = 1, limit: number = 20) =>
    http.get<GetCommentsResponse>(`/posts/comment/${commentId}/replies?page=${page}&limit=${limit}`),

  likeComment: (commentId: string) =>
    http.post<MessageResponse>(`/posts/comment/${commentId}/like`),

  unlikeComment: (commentId: string) =>
    http.delete<MessageResponse>(`/posts/comment/${commentId}/like`),

  updateComment: (commentId: string, content: string) =>
    http.put<GetCommentResponse>(`/posts/comment/${commentId}`, { content }),

  deleteComment: (commentId: string) =>
    http.delete<MessageResponse>(`/posts/comment/${commentId}`),

  deletePost: (id: number | string) =>
    http.delete<MessageResponse>(`/posts/${id}`),
};
