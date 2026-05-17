export interface MediaItem {
    public_id: string;
    url: string;
    type: string;
    duration?: number;
}

export interface CreatePostRequest {
    content: string;
    media?: MediaItem[];
}

export interface user {
    displayName: string;
    username: string;
    avatar: string;
    verified: boolean;
}

export interface PostResponse {
    id: number;
    user: user;
    content: string;
    media?: MediaItem[];
    created_at: string;
    updated_at: string;
}
