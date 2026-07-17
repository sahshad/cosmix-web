import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/services/post.service';
import { PostResponse as PostData } from '@/types/post';
import { toast } from 'sonner';

export const useFeed = (page: number = 1, limit: number = 20) => {
    return useQuery({
        queryKey: ['feed', page, limit],
        queryFn: async () => {
            const { data } = await postService.getFeed(page, limit);
            return (data.posts || []) as PostData[];
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
            // Optimistic update
            await queryClient.cancelQueries({ queryKey: ['feed'] });
            const previousFeed = queryClient.getQueryData(['feed', 1, 20]);
            
            queryClient.setQueryData(['feed', 1, 20], (old: any) => {
                if (!old) return old;
                return old.map((post: PostData) => {
                    if (post.id === id) {
                        return {
                            ...post,
                            isLiked: !isLiked,
                            likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1,
                        };
                    }
                    return post;
                });
            });

            return { previousFeed };
        },
        onError: (err, variables, context: any) => {
            if (context?.previousFeed) {
                queryClient.setQueryData(['feed', 1, 20], context.previousFeed);
            }
            toast.error("Failed to like post");
        }
    });
};
