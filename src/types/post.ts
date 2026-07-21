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

// export interface User {
//     display_name: string;
//     username: string;
//     avatar: string;
//     verified: boolean;
// }

export interface PostResponse {
    id: number;
    user: User;
    content: string;
    media?: MediaItem[];
    likesCount: number;
    isLiked: boolean;
    repostCount: number;
    isReposted: boolean;
    commentsCount: number;
    createdAt: string;
    updatedAt: string;
}
