import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../api/post.service';
import { MediaItem, PostResponse as PostData, GetPostsResponse } from '../types';
import { toast } from 'sonner';
import { omitUndefined } from '@/lib/utils';
import { applyOptimisticUpdate, createInfiniteQueryOptions, flattenInfinitePages, updateCachedItems } from '@/lib/infinite-query';

const POST_LIST_KEY_PREFIXES = ['feed', 'user-posts'];

const getPosts = (response: GetPostsResponse) => response.posts ?? [];
const getPostsPagination = (response: GetPostsResponse) => response.pagination;

const setPosts = (response: GetPostsResponse, posts: PostData[]): GetPostsResponse => ({
    ...response,
    posts,
});

/** Every cache that can hold a post: the feed, a profile's posts, both paginated and flat. */
const POST_LIST_KEYS = POST_LIST_KEY_PREFIXES.map((prefix) => [prefix]);

const patchPostInLists = (
    queryClient: ReturnType<typeof useQueryClient>,
    id: number | string,
    updater: (post: PostData) => PostData | null
) => {
    POST_LIST_KEYS.forEach((queryKey) => {
        updateCachedItems<PostData, GetPostsResponse>(queryClient, queryKey, {
            itemId: id,
            getItems: getPosts,
            setItems: setPosts,
            getItemId: (post) => post.id,
            updater,
        });
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
        mutationFn: async ({ id, isLiked }: { id: number | string; isLiked: boolean }) => {
            if (isLiked) {
                await postService.unlikePost(id);
            } else {
                await postService.likePost(id);
            }
            return { id, isLiked: !isLiked };
        },
        onMutate: async ({ id, isLiked }) => {
            const restore = await applyOptimisticUpdate<PostData, GetPostsResponse>(queryClient, POST_LIST_KEYS, {
                itemId: id,
                getItems: getPosts,
                setItems: setPosts,
                getItemId: (post) => post.id,
                updater: (post) => ({
                    ...post,
                    isLiked: !isLiked,
                    likesCount: Math.max(0, isLiked ? post.likesCount - 1 : post.likesCount + 1),
                }),
            });

            return { restore };
        },
        onError: (_error, _variables, context) => {
            context?.restore?.();
            toast.error("Failed to like post");
        }
    });
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, content, media }: { id: number | string; content: string; media?: MediaItem[] }) => {
            const response = await postService.updatePost(id, content, media);
            // The response may be partial or use a different envelope, so keep
            // what we sent as a fallback for the fields we need to reflect.
            return { id, content, post: response?.post };
        },
        onSuccess: ({ id, content, post }) => {
            toast.success("Post updated");
            patchPostInLists(queryClient, id, (existing) => ({
                ...existing,
                ...omitUndefined(post),
                id: existing.id,
                content: post?.content ?? content,
                media: post?.media ?? existing.media,
                updatedAt: post?.updatedAt !== undefined ? post.updatedAt : existing.updatedAt,
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
        onSuccess: ({ id }) => {
            toast.success("Post deleted");
            patchPostInLists(queryClient, id, () => null);
            POST_LIST_KEYS.forEach((queryKey) => {
                queryClient.invalidateQueries({ queryKey });
            });
        },
        onError: () => {
            toast.error("Failed to delete post");
        }
    });
};
