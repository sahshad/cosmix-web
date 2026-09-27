import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../api/post.service';
import { MediaItem, PostResponse as PostData, GetPostsResponse } from '../types';
import { toast } from 'sonner';
import { createInfiniteQueryOptions, flattenInfinitePages } from '@/lib/infinite-query';

const POST_LIST_KEY_PREFIXES = ['feed', 'user-posts'];

const getPosts = (response: GetPostsResponse) => response.posts ?? [];
const getPostsPagination = (response: GetPostsResponse) => response.pagination;

const patchPostInLists = (
    queryClient: ReturnType<typeof useQueryClient>,
    id: number | string,
    updater: (post: PostData) => PostData
) => {
    POST_LIST_KEY_PREFIXES.forEach((prefix) => {
        // Handle flat array queries (useFeed, useUserPosts)
        queryClient.setQueriesData<PostData[]>({ queryKey: [prefix] }, (old) =>
            Array.isArray(old) ? old.map((post) => (post.id === id ? updater(post) : post)) : old
        );

        // Handle infinite query data structure - match all variations
        // Feed: ['feed', 'infinite', limit]
        // User posts: ['user-posts', userId, 'infinite', limit]
        queryClient.setQueriesData<{ pages: GetPostsResponse[]; pageParams: number[] }>(
            { queryKey: [prefix], exact: false },
            (old) => {
                if (!old || !old.pages) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        posts: page.posts.map((post) =>
                            post.id === id ? updater(post) : post
                        ),
                    })),
                };
            }
        );
    });
};

export const useFeed = (page: number = 1, limit: number = 20) => {
    return useQuery({
        queryKey: ['feed', page, limit],
        queryFn: async () => {
            const response = await postService.getFeed(page, limit);
            return (response.posts || []) as PostData[];
        }
    });
};

export const useInfiniteFeed = (limit: number = 20) => {
    return useInfiniteQuery(createInfiniteQueryOptions<PostData, GetPostsResponse>({
        queryKey: ['feed'],
        fetchPage: (page, limit) => postService.getFeed(page, limit),
        limit,
        getItems: getPosts,
        getPagination: getPostsPagination,
    }));
};

export const useUserPosts = (userId: string | undefined, page: number = 1, limit: number = 20) => {
    return useQuery({
        queryKey: ['user-posts', userId, page, limit],
        queryFn: async () => {
            const response = await postService.getUserPosts(userId as string, page, limit);
            return (response.posts || []) as PostData[];
        },
        enabled: !!userId,
    });
};

export const useInfiniteUserPosts = (userId: string | undefined, limit: number = 20) => {
    return useInfiniteQuery(createInfiniteQueryOptions<PostData, GetPostsResponse>({
        queryKey: ['user-posts', userId],
        fetchPage: (page, limit) => postService.getUserPosts(userId as string, page, limit),
        limit,
        enabled: !!userId,
        getItems: getPosts,
        getPagination: getPostsPagination,
    }));
};

export const flattenFeedPages = (data: { pages: GetPostsResponse[]; pageParams: number[] } | undefined): PostData[] => {
  return flattenInfinitePages(data, getPosts);
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ content, media }: { content: string; media?: MediaItem[] }) => {
            const response = await postService.createPost({ content, media });
            return response.post as PostData;
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
            const response = await postService.updatePost(id, content, media);
            return response.post as PostData;
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
