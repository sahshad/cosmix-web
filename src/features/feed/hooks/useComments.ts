import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    QueryKey,
} from '@tanstack/react-query';
import { postService } from '../api/post.service';
import { CommentResponse, PostPagination, GetCommentsResponse } from '../types';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from 'sonner';
import { createInfiniteQueryOptions, flattenInfinitePages, updateInfiniteQueryCache } from '@/lib/infinite-query';

const COMMENTS_PAGE_SIZE = 4;
const REPLIES_LIMIT = 20;

const getComments = (response: GetCommentsResponse) => response.comments ?? [];
const getCommentsPagination = (response: GetCommentsResponse) => response.pagination;

export const useComments = (postId: number | string) => {
    return useInfiniteQuery(createInfiniteQueryOptions<CommentResponse, GetCommentsResponse>({
        queryKey: ['comments', postId],
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
        queryKey: ['replies', commentId],
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
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            if (variables.parentCommentId) {
                queryClient.invalidateQueries({ queryKey: ['replies', variables.parentCommentId] });
            }
        },
    });
};

export const useToggleCommentLike = (queryKey: QueryKey) => {
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
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData(queryKey);

            updateInfiniteQueryCache(
                queryClient,
                queryKey,
                id,
                getComments,
                (comment) => comment.id,
                (comment) => ({
                    ...comment,
                    isLiked: !isLiked,
                    likesCount: isLiked ? comment.likesCount - 1 : comment.likesCount + 1,
                })
            );

            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous !== undefined) {
                queryClient.setQueryData(queryKey, context.previous);
            }
        },
    });
};

export const useUpdateComment = (queryKey: QueryKey) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, content }: { id: string; content: string }) => {
            const response = await postService.updateComment(id, content);
            return response.comment;
        },
        onSuccess: (updated) => {
            updateInfiniteQueryCache(
                queryClient,
                queryKey,
                updated.id,
                getComments,
                (comment) => comment.id,
                (comment) => ({
                    ...comment,
                    content: updated.content,
                    updatedAt: updated.updatedAt,
                })
            );
        },
        onError: () => {
            toast.error("Failed to update comment");
        },
    });
};

export const useDeleteComment = (queryKey: QueryKey) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await postService.deleteComment(id);
            return id;
        },
        onSuccess: (id) => {
            toast.success("Comment deleted");
            updateInfiniteQueryCache(
                queryClient,
                queryKey,
                id,
                getComments,
                (comment) => comment.id,
                () => null
            );
        },
        onError: () => {
            toast.error("Failed to delete comment");
        },
    });
};