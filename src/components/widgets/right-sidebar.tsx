'use client';

import { TrendingPanel } from './trending-panel';
import { SuggestedUsers } from './suggested-users';

export function RightSidebar() {
  return (
    <div className="space-y-8 hidden lg:block lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-1">
      <TrendingPanel />
      <SuggestedUsers />
    </div>
  );
}
