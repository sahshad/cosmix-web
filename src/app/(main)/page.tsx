'use client';

import { WelcomeCard } from '@/components/widgets/welcome-card';
import { RightSidebar } from '@/components/widgets/right-sidebar';
import { CreatePost } from '@/features/feed/components/create-post';
import { PostCard, PostData } from '@/features/feed/components/post-card';
import { PostFeedSkeleton } from '@/features/feed/components/post-card-skeleton';
import { useInfiniteFeed, useLikePost, flattenFeedPages } from '@/features/feed/hooks/useFeed';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useInfiniteScroll } from '@/hooks';

export default function DashboardPage() {
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteFeed(10);
  const { mutate: toggleLike } = useLikePost();
  const { data: user } = useCurrentUser();
  const { listRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: 400,
  });

  const posts = flattenFeedPages(data);

  const handleLike = (postId: number | string, isLiked: boolean) => {
    toggleLike({ id: postId, isLiked });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-3 sm:gap-8 px-3 py-3 sm:p-6 max-w-312.5 mx-auto lg:h-svh animate-fade-in-up min-w-0">
      {/* Main Feed */}
      <div ref={listRef} className="space-y-3 sm:space-y-8 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-1 min-w-0">
        <WelcomeCard name={user?.displayName || 'there'} />
        <CreatePost />

        {/* Posts Feed */}
        <div className="space-y-3 sm:space-y-8">
          {isLoading ? (
            <PostFeedSkeleton />
          ) : (
            <>
              {posts.map((post: PostData) => (
                <PostCard
                  key={post.id}
                  onLike={() => handleLike(post.id, post.isLiked)}
                  post={post}
                />
              ))}
              {isFetchingNextPage && (
                <div className="py-4 text-center text-muted-foreground">
                  Loading more...
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
}
