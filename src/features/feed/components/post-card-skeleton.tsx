import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PostCardSkeleton() {
  return (
    <Card className="border border-border shadow-none rounded-md bg-card overflow-hidden gap-0 py-5">
      <div className="px-5 sm:px-6 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <div className="px-5 sm:px-6 mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      <Skeleton className="mt-4 mx-5 sm:mx-6 rounded-xl aspect-16/10 min-h-55 max-h-120" />

      <div className="mt-4 px-5 sm:px-6 flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-28" />
      </div>

      <Separator className="mt-3 bg-border/70" />

      <div className="px-3 sm:px-4 pt-1 pb-1 flex items-center gap-1">
        <Skeleton className="h-11 flex-1 rounded-md" />
        <Skeleton className="h-11 flex-1 rounded-md" />
        <Skeleton className="h-11 flex-1 rounded-md" />
        <Skeleton className="h-11 flex-1 rounded-md" />
      </div>
    </Card>
  );
}

interface PostFeedSkeletonProps {
  count?: number;
  className?: string;
}

export function PostFeedSkeleton({ count = 3, className }: PostFeedSkeletonProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
