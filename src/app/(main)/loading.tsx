export default function Loading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 p-6 max-w-[1250px] mx-auto animate-pulse">
      {/* Left Column Feed Skeleton */}
      <div className="space-y-8">
        {/* Welcome Card Skeleton */}
        <div className="h-[120px] rounded-[2rem] bg-secondary/50" />

        {/* Create Post Skeleton */}
        <div className="h-[160px] rounded-[3rem] bg-secondary/40 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-secondary" />
            <div className="h-4 w-48 bg-secondary rounded-full" />
          </div>
          <div className="h-12 rounded-[2rem] bg-secondary/60" />
        </div>

        {/* Post Card Skeletons */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-[20px] bg-card p-6 space-y-6 border border-border/10 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-secondary rounded-full" />
                  <div className="h-3 w-20 bg-secondary/60 rounded-full" />
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-secondary" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-secondary rounded-full" />
              <div className="h-4 w-[90%] bg-secondary rounded-full" />
            </div>
            <div className="h-[200px] rounded-2xl bg-secondary/40" />
            <div className="h-10 rounded-full bg-secondary/30" />
          </div>
        ))}
      </div>

      {/* Right Column Skeleton */}
      <div className="space-y-8 hidden lg:block">
        <div className="h-14 rounded-[2rem] bg-secondary/50" />
        <div className="h-[300px] rounded-[2rem] bg-secondary/30" />
        <div className="h-[300px] rounded-[2rem] bg-secondary/30" />
      </div>
    </div>
  );
}
