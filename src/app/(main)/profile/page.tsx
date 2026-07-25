'use client';

import { ProfileHeader, ProfileData, ProfileTabs, ProfileGallery } from '@/features/profile/components';
import { TrendingPanel } from '@/components/widgets/trending-panel';
import { SuggestedUsers } from '@/components/widgets/suggested-users';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useFollowers, useFollowing } from '@/features/profile/hooks/useUser';
import { useUserPosts, useLikePost } from '@/features/feed/hooks/useFeed';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: followers } = useFollowers(user?.id);
  const { data: following } = useFollowing(user?.id);
  const { data: posts = [], isLoading: isPostsLoading } = useUserPosts(user?.id);
  const { mutate: toggleLike } = useLikePost();

  const profile: ProfileData | null = user
    ? {
        displayName: user.displayName ?? '',
        username: user.username ?? '',
        avatarUrl: user.avatarUrl ?? '',
        coverImageUrl: user.coverImageUrl,
        bio: user.bio,
        location: user.location,
        website: user.website,
        createdAt: user.createdAt,
        followers: followers?.length ?? 0,
        following: following?.length ?? 0,
        isMe: true,
        isVerified: user.isVerified ?? false,
      }
    : null;

  const handleLike = (postId: number | string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    toggleLike({ id: postId, isLiked: post.isLiked });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 p-6 max-w-[1250px] mx-auto animate-fade-in-up">
      {/* Left Column */}
      <div className="space-y-6">
        {isUserLoading || !profile ? (
          <div className="rounded-[2.5rem] bg-card shadow-[0_12px_45px_rgb(0,0,0,0.04)] overflow-hidden">
            <Skeleton className="h-44 sm:h-56 w-full rounded-none" />
            <div className="px-8 pb-8 pt-4 space-y-4">
              <Skeleton className="h-28 w-28 sm:h-36 sm:w-36 rounded-[2.5rem] -mt-16 border-[6px] border-background" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ) : (
          <ProfileHeader profile={profile} />
        )}
        <ProfileTabs posts={posts} onLike={handleLike} isLoading={isPostsLoading} />
      </div>

      {/* Right Column */}
      <div className="space-y-8 hidden lg:block">
        <ProfileGallery posts={posts} />
        <SuggestedUsers title="Picks for You" iconColor="var(--brand-primary)" />
        <TrendingPanel
          title="Trending in Cosmos"
          trends={[
            { tag: 'CosmixDesign', posts: '12K', rank: '01' },
            { tag: 'MatureWeb', posts: '8K', rank: '02' },
          ]}
        />
      </div>
    </div>
  );
}
