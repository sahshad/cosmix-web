'use client';

import { Input } from '@/components/ui/input';
import { TrendingPanel } from './trending-panel';
import { SuggestedUsers } from './suggested-users';

/**
 * The shared right sidebar column used on the home feed and profile pages.
 * Composes: search input + trending topics + suggested users.
 */
export function RightSidebar() {
  return (
    <div className="space-y-8 hidden lg:block">
      {/* Search */}
      <div className="sticky top-8 z-10 w-full group">
        <div className="absolute -inset-1 bg-gradient-to-r from-vivid-blue to-vivid-blue-dark rounded-[2.5rem] opacity-0 group-hover:opacity-20 blur-md transition-opacity" />
        <div className="relative">
          <Input
            placeholder="Explore Cosmix..."
            className="pl-14 h-14 rounded-[2rem] border-0 bg-card/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] focus-visible:ring-2 focus-visible:ring-vivid-blue/30 transition-all font-bold text-[15px]"
          />
          <svg
            className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-vivid-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <TrendingPanel />
      <SuggestedUsers />
    </div>
  );
}
