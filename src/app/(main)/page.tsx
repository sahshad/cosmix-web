'use client';

import { WelcomeCard } from '@/components/widgets/welcome-card';
import { RightSidebar } from '@/components/widgets/right-sidebar';
import { CreatePost } from '@/components/post/create-post';
import { PostCard, PostData } from '@/components/post/post-card';
import { useFeed, useLikePost } from '@/hooks/useFeed';
import { useAuthStore } from '@/store/auth.store';
import { useCurrentUser } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { data: posts = [], isLoading } = useFeed(1, 20);
  const { mutate: toggleLike } = useLikePost();
  // const user = useAuthStore((s) => s.user);
  const { data: user } = useCurrentUser();

  const handleLike = (postId: number | string, isLiked: boolean) => {
    toggleLike({ id: postId, isLiked });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 p-6 max-w-[1250px] mx-auto lg:h-svh animate-fade-in-up">
      {/* Main Feed */}
      <div className="space-y-8 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-1">
        <WelcomeCard name={user?.displayName || 'there'} />
        <CreatePost />

        {/* Posts Feed */}
        <div className="space-y-8">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vivid-blue" />
            </div>
          ) : (
            posts.map((post: PostData) => (
              <PostCard
                key={post.id}
                onLike={() => handleLike(post.id, post.isLiked)}
                post={post}
              />
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
}
