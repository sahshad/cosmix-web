'use client';

import { WelcomeCard } from '@/components/widgets/welcome-card';
import { RightSidebar } from '@/components/widgets/right-sidebar';
import { CreatePost } from '@/features/feed/components/create-post';
import { PostCard, PostData } from '@/features/feed/components/post-card';
import { CenteredLoader } from '@/components/shared';
import { useFeed, useLikePost } from '@/features/feed/hooks/useFeed';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';

export default function DashboardPage() {
  const { data: posts = [], isLoading } = useFeed(1, 20);
  const { mutate: toggleLike } = useLikePost();
  const { data: user } = useCurrentUser();

  const handleLike = (postId: number | string, isLiked: boolean) => {
    toggleLike({ id: postId, isLiked });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 p-6 max-w-312.5 mx-auto lg:h-svh animate-fade-in-up">
      {/* Main Feed */}
      <div className="space-y-8 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-1">
        <WelcomeCard name={user?.displayName || 'there'} />
        <CreatePost />

        {/* Posts Feed */}
        <div className="space-y-8">
          {isLoading ? (
            <CenteredLoader className="p-8" size="2xl" spinnerClassName="text-vivid-blue" />
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
