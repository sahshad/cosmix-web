'use client';

import { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostCard, PostData } from '@/features/feed/components/post-card';
import { PostFeedSkeleton } from '@/features/feed/components/post-card-skeleton';
import { EmptyState } from '@/components/shared';
import { cn } from '@/lib/utils';

interface ProfileTabsProps {
  posts: PostData[];
  onLike: (postId: number | string) => void;
  isLoading?: boolean;
  /** Post to scroll to and briefly highlight (e.g. from clicking a gallery thumbnail). */
  scrollToPostId?: number | string | null;
  onScrolledToPost?: () => void;
}

const tabTriggerClass =
  'flex-1 h-auto rounded-none border-0 border-b-2 border-transparent bg-transparent px-1 py-3.5 font-bold text-[13px] uppercase tracking-wider text-muted-foreground shadow-none transition-colors ' +
  'hover:text-foreground hover:bg-secondary/40 ' +
  'data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=active]:border-vivid-blue ' +
  'dark:data-[state=active]:bg-transparent dark:data-[state=active]:border-vivid-blue';

function PostsPanel({ posts, onLike, isLoading }: ProfileTabsProps) {
  if (isLoading) return <PostFeedSkeleton count={2} className="space-y-6" />;
  if (posts.length === 0) return <EmptyState message="No posts yet." />;
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onLike={onLike} />
      ))}
    </div>
  );
}

export function ProfileTabs({
  posts,
  onLike,
  isLoading,
  scrollToPostId,
  onScrolledToPost,
}: ProfileTabsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const desktopPostsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [desktopTab, setDesktopTab] = useState('posts');

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActiveIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  useEffect(() => {
    if (scrollToPostId == null) return;
    setDesktopTab('posts');

    const raf = requestAnimationFrame(() => {
      const el = desktopPostsRef.current?.querySelector<HTMLElement>(
        `[data-post-id="${scrollToPostId}"]`
      );
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-vivid-blue');
        setTimeout(() => el.classList.remove('ring-2', 'ring-vivid-blue'), 1500);
      }
      onScrolledToPost?.();
    });

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToPostId]);

  return (
    <>
      {/* Mobile: swipe between panels, no tab labels */}
      <div className="sm:hidden">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
        >
          <div className="w-full shrink-0 snap-center">
            <PostsPanel posts={posts} onLike={onLike} isLoading={isLoading} />
          </div>
          <div className="w-full shrink-0 snap-center">
            <EmptyState message="No cosmic replies yet." />
          </div>
          <div className="w-full shrink-0 snap-center">
            <EmptyState message="No cosmic likes yet." />
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={cn(
                'h-1.5 rounded-full transition-all',
                index === activeIndex ? 'w-4 bg-vivid-blue' : 'w-1.5 bg-border'
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop/tablet: standard tabs */}
      <Tabs value={desktopTab} onValueChange={setDesktopTab} className="w-full hidden sm:block">
        <TabsList className="w-full h-auto rounded-none bg-transparent border-0 border-b border-border justify-start gap-0 p-0 shadow-none">
          <TabsTrigger value="posts" className={tabTriggerClass}>
            Posts
          </TabsTrigger>
          <TabsTrigger value="replies" className={tabTriggerClass}>
            Replies
          </TabsTrigger>
          <TabsTrigger value="likes" className={tabTriggerClass}>
            Likes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          <div ref={desktopPostsRef}>
            <PostsPanel posts={posts} onLike={onLike} isLoading={isLoading} />
          </div>
        </TabsContent>
        <TabsContent value="replies">
          <EmptyState message="No cosmic replies yet." />
        </TabsContent>
        <TabsContent value="likes">
          <EmptyState message="No cosmic likes yet." />
        </TabsContent>
      </Tabs>
    </>
  );
}
