import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../api/post.service';
import { MediaItem, PostResponse as PostData } from '../types';
import { toast } from 'sonner';

const POST_LIST_KEY_PREFIXES = ['feed', 'user-posts'];

const patchPostInLists = (
    queryClient: ReturnType<typeof useQueryClient>,
    id: number | string,
    updater: (post: PostData) => PostData
) => {
    POST_LIST_KEY_PREFIXES.forEach((prefix) => {
        queryClient.setQueriesData<PostData[]>({ queryKey: [prefix] }, (old) =>
            Array.isArray(old) ? old.map((post) => (post.id === id ? updater(post) : post)) : old
        );
    });
};

export const useFeed = (page: number = 1, limit: number = 20) => {
    return useQuery({
        queryKey: ['feed', page, limit],
        queryFn: async () => {
            const { data } = await postService.getFeed(page, limit);
            return (data.posts || []) as PostData[];
        }
    });
};

export const useUserPosts = (userId: string | undefined, page: number = 1, limit: number = 20) => {
    return useQuery({
        queryKey: ['user-posts', userId, page, limit],
        queryFn: async () => {
            const { data } = await postService.getUserPosts(userId as string, page, limit);
            return (data.posts || []) as PostData[];
        },
        enabled: !!userId,
    });
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ content, media }: { content: string; media?: MediaItem[] }) => {
            const { data } = await postService.createPost({ content, media });
            return data.post as PostData;
        },
        onSuccess: () => {
            toast.success("Post created successfully!");
            queryClient.invalidateQueries({ queryKey: ['feed'] });
        },
        onError: () => {
            toast.error("Failed to create post");
        }
    });
};

export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, isLiked }: { id: number | string, isLiked: boolean }) => {
            if (isLiked) {
                await postService.unlikePost(id);
            } else {
                await postService.likePost(id);
            }
            return { id, isLiked: !isLiked };
        },
        onMutate: async ({ id, isLiked }) => {
            await Promise.all(POST_LIST_KEY_PREFIXES.map((prefix) => queryClient.cancelQueries({ queryKey: [prefix] })));

            const previous = POST_LIST_KEY_PREFIXES.map((prefix) => [prefix, queryClient.getQueriesData({ queryKey: [prefix] })] as const);

            patchPostInLists(queryClient, id, (post) => ({
                ...post,
                isLiked: !isLiked,
                likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1,
            }));

            return { previous };
        },
        onError: (_err, _variables, context) => {
            context?.previous?.forEach(([, entries]) => {
                entries.forEach(([key, data]) => queryClient.setQueryData(key, data));
            });
            toast.error("Failed to like post");
        }
    });
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, content, media }: { id: number | string; content: string; media?: MediaItem[] }) => {
            const { data } = await postService.updatePost(id, content, media);
            return data.post as PostData;
        },
        onSuccess: (updated) => {
            toast.success("Post updated");
            patchPostInLists(queryClient, updated.id, (post) => ({
                ...post,
                content: updated.content,
                media: updated.media,
                updatedAt: updated.updatedAt,
            }));
        },
        onError: () => {
            toast.error("Failed to update post");
        }
    });
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number | string) => {
            await postService.deletePost(id);
            return { id };
        },
        onSuccess: () => {
            toast.success("Post deleted");
            POST_LIST_KEY_PREFIXES.forEach((prefix) => queryClient.invalidateQueries({ queryKey: [prefix] }));
        },
        onError: () => {
            toast.error("Failed to delete post");
        }
    });
};
