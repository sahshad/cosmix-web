'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { isAxiosError } from 'axios';
import { ProfileHeader, ProfileData, ProfileTabs, ProfileGallery } from '@/features/profile/components';
import { TrendingPanel } from '@/components/widgets/trending-panel';
import { SuggestedUsers } from '@/components/widgets/suggested-users';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useToggleFollow, useUserByUsername } from '@/features/profile/hooks/useUser';
import { useUserPosts, useLikePost } from '@/features/feed/hooks/useFeed';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared';

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data: currentUser } = useCurrentUser();
  const {
    data: user,
    isLoading: isUserLoading,
    isError,
    error,
  } = useUserByUsername(username);
  const { data: posts = [], isLoading: isPostsLoading } = useUserPosts(user?.id);
  const { mutate: toggleLike } = useLikePost();
  const { mutate: toggleFollow, isPending: isFollowPending } = useToggleFollow();
  const [scrollToPostId, setScrollToPostId] = useState<number | string | null>(null);

  const notFound = isError && isAxiosError(error) && error.response?.status === 404;
  const isMe = !!currentUser && !!user && currentUser.id === user.id;
  const isFollowing = !isMe && !!user?.isFollowing;

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
        followers: user.followersCount ?? 0,
        following: user.followingCount ?? 0,
        isMe,
        isVerified: user.isVerified ?? false,
      }
    : null;

  const handleLike = (postId: number | string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    toggleLike({ id: postId, isLiked: post.isLiked });
  };

  const handleToggleFollow = () => {
    if (!user) return;
    toggleFollow({ userId: user.id, isFollowing });
  };

  if (notFound) {
    return (
      <div className="max-w-312.5 mx-auto px-3 py-3 sm:p-6">
        <EmptyState message={`No one goes by @${username} here.`} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-3 sm:gap-8 px-3 py-3 sm:p-6 max-w-312.5 mx-auto lg:h-svh animate-fade-in-up">
      {/* Left Column */}
      <div className="space-y-3 sm:space-y-6 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-1">
        {isUserLoading || !profile ? (
          <div className="-mx-3 sm:mx-0 rounded-none sm:rounded-[2.5rem] bg-card shadow-[0_12px_45px_rgb(0,0,0,0.04)] overflow-hidden">
            <Skeleton className="h-44 sm:h-56 w-full rounded-none" />
            <div className="px-4 sm:px-8 pb-8 pt-4 space-y-4">
              <Skeleton className="h-28 w-28 sm:h-36 sm:w-36 rounded-[2.5rem] -mt-16 border-[6px] border-background" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ) : (
          <ProfileHeader
            profile={profile}
            isFollowing={isFollowing}
            isFollowPending={isFollowPending}
            onToggleFollow={handleToggleFollow}
          />
        )}
        <ProfileTabs
          posts={posts}
          onLike={handleLike}
          isLoading={isPostsLoading}
          scrollToPostId={scrollToPostId}
          onScrolledToPost={() => setScrollToPostId(null)}
        />
      </div>

      {/* Right Column */}
      <div className="space-y-3 sm:space-y-8 hidden lg:block lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-1">
        <ProfileGallery posts={posts} onSelectPost={setScrollToPostId} />
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
