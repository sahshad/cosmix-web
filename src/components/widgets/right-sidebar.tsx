'use client';

import { TrendingPanel } from './trending-panel';
import { SuggestedUsers } from './suggested-users';
import { cn } from '@/lib/utils';

interface RightSidebarProps {
  className?: string
}

export function RightSidebar({className}:RightSidebarProps) {
  return (
    <div className={cn("space-y-8 hidden lg:block lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-1", className)}>
      <TrendingPanel />
      <SuggestedUsers />
    </div>
  );
}
