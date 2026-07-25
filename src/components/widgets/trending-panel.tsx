'use client';

import { MoreHorizontal, TrendingUp } from 'lucide-react';
import { PanelCard } from '@/components/shared/panel-card';
import { SectionHeader } from '@/components/shared/section-header';

export interface TrendItem {
  tag: string;
  posts: string;
  color?: string;
  rank: string;
}

const DEFAULT_TRENDS: TrendItem[] = [
  { tag: 'ReactJS', posts: '284K', color: 'var(--brand-primary)', rank: '01' },
  { tag: 'WebDev', posts: '156K', color: '#11a657', rank: '02' },
  { tag: 'CosmixLaunch', posts: '89K', color: '#f8b301', rank: '03' },
  { tag: 'DesignSys', posts: '45K', color: '#f84b4b', rank: '04' },
];

interface TrendingPanelProps {
  trends?: TrendItem[];
  title?: string;
}

export function TrendingPanel({
  trends = DEFAULT_TRENDS,
  title = 'Trending Now',
}: TrendingPanelProps) {
  return (
    <PanelCard>
      <SectionHeader icon={TrendingUp} label={title} iconColor="#f8b301" />
      <div className="space-y-4">
        {trends.map((trend) => (
          <button
            key={trend.tag}
            className="w-full text-left p-4 rounded-3xl bg-secondary/20 hover:bg-secondary/60 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <span className="font-bold text-muted-foreground/40 text-lg group-hover:text-foreground transition-colors">
                {trend.rank}
              </span>
              <div>
                <p className="font-bold text-[14px] text-foreground group-hover:text-vivid-blue transition-colors font-sans">
                  #{trend.tag}
                </p>
                <p className="text-[12px] font-medium text-muted-foreground mt-0.5">
                  {trend.posts} posts
                </p>
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm translate-x-[-10px] group-hover:translate-x-0">
              <MoreHorizontal className="h-4 w-4 text-foreground" />
            </div>
          </button>
        ))}
      </div>
    </PanelCard>
  );
}
