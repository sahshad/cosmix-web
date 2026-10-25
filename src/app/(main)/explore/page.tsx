'use client';

import {
  ExploreSearch,
  TrendingTopics,
  DiscoverCreators,
  ExploreFeed,
  ExploreSidebar,
} from "@/features/explore/components";
import { PostFeedSkeleton } from "@/features/feed/components/post-card-skeleton";
import { useFeed, useLikePost } from "@/features/feed/hooks/useFeed";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

export default function ExplorePage() {
  const { data: posts = [], isLoading } = useFeed(1, 20);
  const { mutate: toggleLike } = useLikePost();
  const { state: sidebarState } = useSidebar()

  const handleLike = (postId: number | string, isLiked: boolean) => {
    toggleLike({ id: postId, isLiked });
  };

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-3 sm:gap-8 px-3 py-3 sm:p-6 max-w-312.5 mx-auto lg:h-svh animate-fade-in-up min-w-0',
        'transition-[grid-template-columns] duration-500 ease-in-out',
        sidebarState === 'collapsed'
          ? 'lg:grid-cols-[minmax(0,1fr)_480px]'
          : 'lg:grid-cols-[minmax(0,1fr)_380px]'
      )}
    >
      {/* Main - Explore */}
      <div
        className={cn(
          "max-w-150 space-y-3 sm:space-y-8 min-w-0 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-1",
          'transition-[padding] duration-500 ease-in-out',
          sidebarState === 'collapsed' ? "px-8" : ""
        )}
      >
        <ExploreSearch />
        <TrendingTopics />
        <DiscoverCreators />
        {isLoading ? (
          <PostFeedSkeleton />
        ) : (
          <ExploreFeed posts={posts} onLike={handleLike} />
        )}
      </div>

      {/* Right Sidebar - Top Communities & Topics */}
      <ExploreSidebar className={cn(
        'transition-[padding] duration-500 ease-in-out',
        sidebarState === 'collapsed' ? "pl-6" : ""
      )} />
    </div>
  );
}
