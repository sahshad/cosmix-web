'use client';

import { Users } from 'lucide-react';
import { PanelCard } from '@/components/shared/panel-card';
import { SectionHeader } from '@/components/shared/section-header';
import { UserListItem } from '@/components/shared/user-list-item';

export interface SuggestedUser {
  name: string;
  handle: string;
  avatar: string;
}

const DEFAULT_USERS: SuggestedUser[] = [
  { name: 'Jane Smith', handle: 'janesmith', avatar: 'jane' },
  { name: 'David Park', handle: 'davidpark', avatar: 'david' },
  { name: 'Lisa Wang', handle: 'lisawang', avatar: 'lisa' },
];

interface SuggestedUsersProps {
  users?: SuggestedUser[];
  title?: string;
  iconColor?: string;
}

export function SuggestedUsers({
  users = DEFAULT_USERS,
  title = 'Picks for You',
  iconColor = '#11a657',
}: SuggestedUsersProps) {
  return (
    <PanelCard>
      <SectionHeader icon={Users} label={title} iconColor={iconColor} />
      <div className="space-y-5">
        {users.map((user) => (
          <UserListItem
            key={user.handle}
            name={user.name}
            handle={user.handle}
            avatarSeed={user.avatar}
            variant="compact"
            ringColor={iconColor}
          />
        ))}
      </div>
    </PanelCard>
  );
}
