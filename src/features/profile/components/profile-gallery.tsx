'use client';

import { ImageIcon, Images, Video } from 'lucide-react';
import Image from 'next/image';
import { PanelCard } from '@/components/shared/panel-card';
import { SectionHeader } from '@/components/shared/section-header';

interface MediaPost {
  id: number | string;
  media?: { url: string; type?: string }[];
}

interface ProfileGalleryProps {
  posts: MediaPost[];
  onSelectPost?: (postId: number | string) => void;
}

export function ProfileGallery({ posts, onSelectPost }: ProfileGalleryProps) {
  const mediaPosts = posts.filter((p) => p.media && p.media.length > 0);

  return (
    <PanelCard radius="md">
      <SectionHeader
        icon={Images}
        label="Glimpses of Cosmos"
        iconColor="#11a657"
      />
      <div className="grid grid-cols-3 gap-2">
        {mediaPosts.map((post) => {
          const item = post.media![0];
          const isVideo = item.type === 'video';
          return (
            <div
              key={post.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectPost?.(post.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectPost?.(post.id);
                }
              }}
              className="aspect-square rounded-xl overflow-hidden group cursor-pointer border border-border/20 shadow-sm relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vivid-blue"
            >
              {isVideo ? (
                <video
                  src={item.url}
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <Image
                  src={item.url}
                  alt="Gallery item"
                  fill
                  sizes="(max-width: 1024px) 33vw, 120px"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              )}
              <div className="absolute top-1.5 left-1.5 h-5 w-5 rounded-full bg-black/50 text-white grid place-items-center">
                {isVideo ? (
                  <Video className="h-2.75 w-2.75" />
                ) : (
                  <ImageIcon className="h-2.75 w-2.75" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          );
        })}
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
