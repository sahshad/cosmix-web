import { Skeleton } from "@/components/ui/skeleton";

export function CommentSkeleton() {
  return (
    <div className="flex items-start gap-2.5">
      <Skeleton className="h-9 w-9 rounded-full shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className="h-14 rounded-sm" />
        <Skeleton className="h-3 w-24 ml-1" />
      </div>
    </div>
  );
}

interface CommentListSkeletonProps {
  count?: number;
}

export function CommentListSkeleton({ count = 3 }: CommentListSkeletonProps) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
}
