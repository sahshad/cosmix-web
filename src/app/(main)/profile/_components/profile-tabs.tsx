'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostCard } from '@/components/post/post-card';
import { Loader2 } from 'lucide-react';

interface ProfileTabsProps {
  posts: any[];
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
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground font-bold text-sm uppercase tracking-widest bg-card rounded-[2.5rem] shadow-sm">
            No posts yet.
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} onLike={onLike} />)
        )}
      </TabsContent>
      <TabsContent
        value="replies"
        className="p-12 text-center text-muted-foreground font-bold text-sm uppercase tracking-widest bg-card rounded-[2.5rem] shadow-sm"
      >
        No cosmic replies yet.
      </TabsContent>
      <TabsContent
        value="likes"
        className="p-12 text-center text-muted-foreground font-bold text-sm uppercase tracking-widest bg-card rounded-[2.5rem] shadow-sm"
      >
        No cosmic likes yet.
      </TabsContent>
    </Tabs>
  );
}
