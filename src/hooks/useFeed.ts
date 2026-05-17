import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/services/post.service';
import { userService } from '@/services/user.service';
import { PostData, PostAuthor } from '@/components/internal/post-card';
import { toast } from 'sonner';

export const useFeed = (page: number = 1, limit: number = 20) => {
    return useQuery({
        queryKey: ['feed', page, limit],
        queryFn: async () => {
            // 1. Fetch posts
            const { data } = await postService.getFeed(page, limit);
            const posts = data.posts || [];
            
            // 2. Extract unique author IDs (filter out undefined if backend hasn't updated yet)
            const authorIds = Array.from(new Set(posts.map((p: any) => p.author_id))).filter(id => id != null) as number[];
            
            // 3. Fetch user profiles for these authors
            const userPromises = authorIds.map(id => userService.getById(id).then(res => res.data));
            const users = await Promise.all(userPromises);
            
            // 4. Create a map of authorId -> User profile
            const userMap = new Map<number, PostAuthor>();
            users.forEach((u: any) => {
                if (u && u.user) {
                    userMap.set(u.user.auth_user_id, {
                        name: `${u.user.first_name} ${u.user.last_name}`,
                        handle: `@${u.user.username}`,
                        avatar: u.user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.user.username}`,
                        verified: true, // Assuming true for now or add logic
                    });
                }
            });

            // 5. Merge author data into posts
            const enrichedPosts: PostData[] = posts.map((p: any) => {
                const author = userMap.get(p.author_id) || {
                    name: 'Unknown User',
                    handle: '@unknown',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown',
                    verified: false
                };

                return {
                    id: p.id,
                    author,
                    content: p.content,
                    media: p.media && p.media.length > 0 ? p.media[0].url : null,
                    timestamp: new Date(p.created_at).toLocaleDateString(), // Or format relatively e.g. "2 hours ago"
                    likes: p.likes || 0,
                    replies: p.comments || 0,
                    reposts: 0,
                    liked: p.liked || false,
                };
            });

            return enrichedPosts;
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
                            liked: !isLiked,
                            likes: isLiked ? post.likes - 1 : post.likes + 1,
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
