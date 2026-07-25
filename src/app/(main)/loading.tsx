import { PostFeedSkeleton } from '@/features/feed/components/post-card-skeleton';

export default function Loading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 p-6 max-w-312.5 mx-auto animate-pulse">
      {/* Left Column Feed Skeleton */}
      <div className="space-y-8">
        {/* Welcome Card Skeleton */}
        <div className="h-30 rounded-4xl bg-secondary/50" />

        {/* Create Post Skeleton */}
        <div className="h-40 rounded-[3rem] bg-secondary/40 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-secondary" />
            <div className="h-4 w-48 bg-secondary rounded-full" />
          </div>
          <div className="h-12 rounded-4xl bg-secondary/60" />
        </div>

        <PostFeedSkeleton />
      </div>

      {/* Right Column Skeleton */}
      <div className="space-y-8 hidden lg:block">
        <div className="h-14 rounded-4xl bg-secondary/50" />
        <div className="h-75 rounded-4xl bg-secondary/30" />
        <div className="h-75 rounded-4xl bg-secondary/30" />
      </div>
    </div>
  );
}
