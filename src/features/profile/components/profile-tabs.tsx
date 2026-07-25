'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostCard, PostData } from '@/features/feed/components/post-card';
import { CenteredLoader, EmptyState } from '@/components/shared';

interface ProfileTabsProps {
  posts: PostData[];
  onLike: (postId: number | string) => void;
  isLoading?: boolean;
}

const tabTriggerClass =
  'flex-1 h-full rounded-2xl data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-vivid-blue font-bold text-[13px] uppercase tracking-wider transition-all';

export function ProfileTabs({ posts, onLike, isLoading }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="w-full h-14 rounded-3xl border border-border/40 bg-card/50 backdrop-blur-sm flex justify-around p-1 shadow-sm">
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

      <TabsContent value="posts" className="space-y-6 mt-6">
        {isLoading ? (
          <CenteredLoader className="p-8" />
        ) : posts.length === 0 ? (
          <EmptyState message="No posts yet." />
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} onLike={onLike} />)
        )}
      </TabsContent>
      <TabsContent value="replies">
        <EmptyState message="No cosmic replies yet." />
      </TabsContent>
      <TabsContent value="likes">
        <EmptyState message="No cosmic likes yet." />
      </TabsContent>
    </Tabs>
  );
}
