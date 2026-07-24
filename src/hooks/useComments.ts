import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    QueryKey,
} from '@tanstack/react-query';
import { postService } from '@/services/post.service';
import { CommentResponse } from '@/types/post';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from 'sonner';

const COMMENTS_PAGE_SIZE = 4;
const REPLIES_LIMIT = 20;

// A comment-list cache entry is either a flat array (useReplies) or an
// infinite-query { pages } object (useComments) — apply `fn` to whichever shape it is.
const mapCommentList = (old: any, fn: (comments: CommentResponse[]) => CommentResponse[]) => {
    if (!old) return old;
    if (Array.isArray(old)) return fn(old);
    if (old.pages) {
        return {
            ...old,
            pages: old.pages.map((page: any) => ({ ...page, comments: fn(page.comments) })),
        };
    }
    return old;
};

export const useComments = (postId: number | string) => {
    return useInfiniteQuery({
        queryKey: ['comments', postId],
        queryFn: async ({ pageParam }: { pageParam: number }) => {
            const { data } = await postService.getComments(postId, pageParam, COMMENTS_PAGE_SIZE);
            return {
                comments: (data.comments ?? []) as CommentResponse[],
                pagination: data.pagination as { page: number; totalPages: number } | undefined,
            };
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const p = lastPage.pagination;
            if (!p || p.page >= p.totalPages) return undefined;
            return p.page + 1;
        },
    });
};

export const useReplies = (commentId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['replies', commentId],
        queryFn: async () => {
            const { data } = await postService.getReplies(commentId, 1, REPLIES_LIMIT);
            return (data.comments ?? []) as CommentResponse[];
        },
        enabled,
    });
};

export const useCreateComment = (postId: number | string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ content, parentCommentId }: { content: string; parentCommentId?: string }) => {
            const { data } = await postService.createComment(postId, content, parentCommentId);
            return data.comment as CommentResponse;
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

            const patch = (comment: CommentResponse): CommentResponse =>
                comment.id === id
                    ? {
                        ...comment,
                        isLiked: !isLiked,
                        likesCount: isLiked ? comment.likesCount - 1 : comment.likesCount + 1,
                    }
                    : comment;

            queryClient.setQueryData(queryKey, (old: any) => mapCommentList(old, (comments) => comments.map(patch)));

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
            const { data } = await postService.updateComment(id, content);
            return data.comment as CommentResponse;
        },
        onSuccess: (updated) => {
            queryClient.setQueryData(queryKey, (old: any) =>
                mapCommentList(old, (comments) =>
                    comments.map((comment) =>
                        comment.id === updated.id
                            ? { ...comment, content: updated.content, updatedAt: updated.updatedAt }
                            : comment
                    )
                )
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
            queryClient.setQueryData(queryKey, (old: any) =>
                mapCommentList(old, (comments) => comments.filter((comment) => comment.id !== id))
            );
        },
        onError: () => {
            toast.error("Failed to delete comment");
        },
    });
};
