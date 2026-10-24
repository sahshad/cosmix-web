import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    QueryClient,
} from '@tanstack/react-query';
import { postService } from '../api/post.service';
import { CommentResponse, GetCommentsResponse } from '../types';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from 'sonner';
import { omitUndefined } from '@/lib/utils';
import { applyOptimisticUpdate, createInfiniteQueryOptions, flattenInfinitePages, updateCachedItems } from '@/lib/infinite-query';

const COMMENTS_PAGE_SIZE = 4;
const REPLIES_LIMIT = 20;

const COMMENTS_KEY = 'comments';
const REPLIES_KEY = 'replies';

/** Every cache that can hold a comment: the paginated comments list and the flat reply lists. */
const COMMENT_CACHE_KEYS = [COMMENTS_KEY, REPLIES_KEY];

const COMMENT_LIST_KEYS = COMMENT_CACHE_KEYS.map((key) => [key]);

const getComments = (response: GetCommentsResponse) => response.comments ?? [];
const getCommentsPagination = (response: GetCommentsResponse) => response.pagination;

const setComments = (response: GetCommentsResponse, comments: CommentResponse[]): GetCommentsResponse => ({
    ...response,
    comments,
});

/**
 * Applies `updater` to the comment with the given id in every comment cache.
 * Works for top level comments (infinite query) and replies (flat array).
 */
const patchCommentInCaches = (
    queryClient: QueryClient,
    id: string,
    updater: (comment: CommentResponse) => CommentResponse | null
) => {
    COMMENT_LIST_KEYS.forEach((queryKey) => {
        updateCachedItems<CommentResponse, GetCommentsResponse>(queryClient, queryKey, {
            itemId: id,
            getItems: getComments,
            setItems: setComments,
            getItemId: (comment) => comment.id,
            updater,
        });
    });
};

export const useComments = (postId: number | string) => {
    return useInfiniteQuery(createInfiniteQueryOptions<CommentResponse, GetCommentsResponse>({
        queryKey: [COMMENTS_KEY, postId],
        fetchPage: (page, limit) => postService.getComments(postId, page, limit),
        limit: COMMENTS_PAGE_SIZE,
        getItems: getComments,
        getPagination: getCommentsPagination,
    }));
};

export const flattenCommentPages = (data: { pages: GetCommentsResponse[]; pageParams: number[] } | undefined): CommentResponse[] => {
    return flattenInfinitePages(data, getComments);
};

export const useReplies = (commentId: string, enabled: boolean) => {
    return useQuery({
        queryKey: [REPLIES_KEY, commentId],
        queryFn: async () => {
            const response = await postService.getReplies(commentId, 1, REPLIES_LIMIT);
            return response.comments ?? [];
        },
        enabled,
    });
};

export const useCreateComment = (postId: number | string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ content, parentCommentId }: { content: string; parentCommentId?: string }) => {
            const response = await postService.createComment(postId, content, parentCommentId);
            return response.comment;
        },
        onSuccess: (_comment, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.feed] });
            queryClient.invalidateQueries({ queryKey: [COMMENTS_KEY, postId] });
            if (variables.parentCommentId) {
                queryClient.invalidateQueries({ queryKey: [REPLIES_KEY, variables.parentCommentId] });
            }
        },
    });
};

export const useToggleCommentLike = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, isLiked }: { id: string; isLiked: boolean }) => {
            if (isLiked) {
                await postService.unlikeComment(id);
            } else {
                await postService.likeComment(id);
            }
        },
        onMutate: async ({ id, isLiked }) => {
            const restore = await applyOptimisticUpdate<CommentResponse, GetCommentsResponse>(
                queryClient,
                COMMENT_LIST_KEYS,
                {
                    itemId: id,
                    getItems: getComments,
                    setItems: setComments,
                    getItemId: (comment) => comment.id,
                    updater: (comment) => ({
                        ...comment,
                        isLiked: !isLiked,
                        likesCount: Math.max(0, isLiked ? comment.likesCount - 1 : comment.likesCount + 1),
                    }),
                }
            );

            return { restore };
        },
        onError: (_error, _variables, context) => {
            context?.restore?.();
            toast.error("Failed to like comment");
        },
    });
};

export const useUpdateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, content }: { id: string; content: string }) => {
            const response = await postService.updateComment(id, content);
            // The response may be partial or use a different envelope, so keep
            // what we sent as a fallback for the fields we need to reflect.
            return { id, content, comment: response?.comment };
        },
        onSuccess: ({ id, content, comment }) => {
            patchCommentInCaches(queryClient, id, (existing) => ({
                ...existing,
                ...omitUndefined(comment),
                id: existing.id,
                content: comment?.content ?? content,
                updatedAt: comment?.updatedAt !== undefined ? comment.updatedAt : existing.updatedAt,
            }));
        },
        onError: () => {
            toast.error("Failed to update comment");
        },
    });
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await postService.deleteComment(id);
            return id;
        },
        onSuccess: (id) => {
            toast.success("Comment deleted");
            patchCommentInCaches(queryClient, id, () => null);
            COMMENT_LIST_KEYS.forEach((queryKey) => {
                queryClient.invalidateQueries({ queryKey });
            });
        },
        onError: () => {
            toast.error("Failed to delete comment");
        },
    });
};