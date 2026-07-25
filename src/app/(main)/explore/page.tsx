'use client';

import React from "react";
import { ExploreSearch } from "./_components/explore-search";
import { TrendingTopics } from "./_components/trending-topics";
import { DiscoverCreators } from "./_components/discover-creators";
import { ExploreFeed } from "./_components/explore-feed";
import { ExploreSidebar } from "./_components/explore-sidebar";
import { CenteredLoader } from "@/components/shared";
import { useFeed } from "@/hooks/useFeed";

export default function ExplorePage() {
  const { data: posts = [], isLoading } = useFeed(1, 20);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 p-6 max-w-[1250px] mx-auto animate-fade-in-up">
      {/* Main Content */}
      <div className="space-y-8 min-w-0">
        <ExploreSearch />
        <TrendingTopics />
        <DiscoverCreators />
        {isLoading ? (
          <CenteredLoader className="p-8" size="2xl" spinnerClassName="text-vivid-blue" />
        ) : (
          <ExploreFeed posts={posts} />
        )}
      </div>

      {/* Right Sidebar - Top Communities & Topics */}
      <ExploreSidebar />
    </div>
  );
}
