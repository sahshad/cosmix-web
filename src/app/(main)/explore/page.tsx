'use client';

import React from "react";
import {
  ExploreSearch,
  TrendingTopics,
  DiscoverCreators,
  ExploreFeed,
  ExploreSidebar,
} from "@/features/explore/components";
import { PostFeedSkeleton } from "@/features/feed/components/post-card-skeleton";
import { useFeed } from "@/features/feed/hooks/useFeed";

export default function ExplorePage() {
  const { data: posts = [], isLoading } = useFeed(1, 20);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 p-6 max-w-312.5 mx-auto animate-fade-in-up">
      {/* Main Content */}
      <div className="space-y-8 min-w-0">
        <ExploreSearch />
        <TrendingTopics />
        <DiscoverCreators />
        {isLoading ? (
          <PostFeedSkeleton />
        ) : (
          <ExploreFeed posts={posts} />
        )}
      </div>

      {/* Right Sidebar - Top Communities & Topics */}
      <ExploreSidebar />
    </div>
  );
}
