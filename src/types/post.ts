import { User } from "./user";

export interface MediaItem {
    publicId: string;
    url: string;
    type: string;
    duration?: number;
}

export interface Media {
    id: string;
    postId: string;
    publicId: string;
    url: string;
    type: string;
    duration: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePostRequest {
    content: string;
    media?: MediaItem[];
}

export interface PostResponse {
    id: string;
    user: User;
    content: string;
    media?: Media[];
    likesCount: number;
    isLiked: boolean;
    sharesCount: number;
    commentsCount: number;
    isOwner: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CommentResponse {
    id: string;
    postId: string;
    authorId: string;
    user: User;
    content: string;
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    repliesCount: number;
    isLiked: boolean;
    isOwner: boolean;
    parentCommentId: string;
}

export interface PostPagination {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface MessageResponse {
    message: string;
}

export interface GetPostResponse {
    post: PostResponse;
}

export interface GetPostsResponse {
    posts: PostResponse[];
    pagination: PostPagination;
}

export interface GetCommentResponse {
    comment: CommentResponse;
}

export interface GetCommentsResponse {
    comments: CommentResponse[];
    pagination: PostPagination;
}
