'use client';

import { useState } from 'react';
import { ProfileHeader, ProfileData, ProfileTabs, ProfileGallery } from '@/features/profile/components';
import { TrendingPanel } from '@/components/widgets/trending-panel';
import { SuggestedUsers } from '@/components/widgets/suggested-users';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useUserPosts, useLikePost } from '@/features/feed/hooks/useFeed';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

export default function ProfilePage() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: posts = [], isLoading: isPostsLoading } = useUserPosts(user?.id);
  const { mutate: toggleLike } = useLikePost();
  const [scrollToPostId, setScrollToPostId] = useState<number | string | null>(null);
  const { state: sidebarState } = useSidebar()


  const profile: ProfileData | null = user
    ? {
      id: user.id,
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
    <div
      className={cn(
        'grid grid-cols-1 gap-3 sm:gap-8 px-3 py-3 sm:p-6 max-w-312.5 mx-auto lg:h-svh animate-fade-in-up min-w-0',
        'transition-[grid-template-colums] duration-500 ease-in-out',
        sidebarState === 'collapsed'
          ? 'lg:grid-cols-[minmax(0,1fr)_480px]'
          : 'lg:grid-cols-[minmax(0,1fr)_380px]'
      )}
    >
      {/* Main - Profile & Tabs Data */}
      <div
        className={cn(
          "space-y-3 sm:space-y-6 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-1",
          'transition-[padding] duration-500 ease-in-out',
          sidebarState === 'collapsed' ? "px-8" : ""
        )}
      >
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
          <ProfileHeader profile={profile} />
        )}
        <ProfileTabs
          posts={posts}
          onLike={handleLike}
          isLoading={isPostsLoading}
          scrollToPostId={scrollToPostId}
          onScrolledToPost={() => setScrollToPostId(null)}
        />
      </div>

      {/* Right Sidebar - Gallery & Suggestion */}
      <div
        className={cn(
          "space-y-3 sm:space-y-8 hidden lg:block lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-1",
          'transition-[padding] duration-500 ease-in-out',
          sidebarState === 'collapsed' ? "pl-6" : ""
        )}
      >
        <ProfileGallery posts={posts} onSelectPost={setScrollToPostId} />
        <SuggestedUsers title="Picks for You" iconColor="var(--brand-primary)" />
        <TrendingPanel
          title="Trending in Cosmos"
          trends={[
            { tag: 'CosmixDesign', posts: 12000, rank: '01' },
            { tag: 'MatureWeb', posts: 8000, rank: '02' },
          ]}
        />
      </div>
    </div>
  );
}
