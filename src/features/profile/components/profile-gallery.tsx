'use client';

import { Images } from 'lucide-react';
import { PanelCard } from '@/components/shared/panel-card';
import { SectionHeader } from '@/components/shared/section-header';

interface MediaPost {
  id: number | string;
  media?: { url: string }[];
}

interface ProfileGalleryProps {
  posts: MediaPost[];
}

export function ProfileGallery({ posts }: ProfileGalleryProps) {
  const mediaPosts = posts.filter((p) => p.media && p.media.length > 0);

  return (
    <PanelCard radius="lg">
      <SectionHeader
        icon={Images}
        label="Glimpses of Cosmos"
        iconColor="#11a657"
      />
      <div className="grid grid-cols-3 gap-2">
        {mediaPosts.map((post) => (
          <div
            key={post.id}
            className="aspect-square rounded-xl overflow-hidden group cursor-pointer border border-border/20 shadow-sm relative"
          >
            <img
              src={post.media![0].url}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              alt="Gallery item"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
        {/* Fill remaining slots to complete grid */}
        {Array.from({ length: Math.max(0, 9 - mediaPosts.length) }).map(
          (_, i) => (
            <div
              key={`placeholder-${i}`}
              className="aspect-square rounded-xl bg-secondary/20 border border-border/10 flex items-center justify-center"
            >
              <div className="h-4 w-4 rounded-full bg-muted-foreground/10" />
            </div>
          )
        )}
      </div>
    </PanelCard>
  );
}
