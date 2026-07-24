import { User } from "./user";

export interface MediaItem {
    publicId: string;
    url: string;
    type: string;
    duration?: number;
}

export interface CreatePostRequest {
    content: string;
    media?: MediaItem[];
}

export interface PostResponse {
    id: string;
    user: User;
    content: string;
    media?: MediaItem[];
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
