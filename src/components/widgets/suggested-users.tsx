'use client';

import { Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/shared/section-header';
import FollowButton from '@/components/shared/follow-button';

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
    <Card className="border-0 shadow-[0_12px_45px_rgb(0,0,0,0.04)] rounded-[14px] bg-card p-6">
      <SectionHeader icon={Users} label={title} iconColor={iconColor} />
      <div className="space-y-5">
        {users.map((user) => (
          <div
            key={user.handle}
            className="flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer">
              <Avatar
                className={`h-10 w-10 ring-2 ring-transparent group-hover:ring-[${iconColor}]/30 transition-all shadow-sm`}
              >
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`}
                  alt={user.name}
                />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-foreground group-hover:underline truncate">
                  {user.name}
                </p>
                <p className="text-[11px] font-medium text-muted-foreground truncate">
                  @{user.handle}
                </p>
              </div>
            </div>
            <FollowButton />
          </div>
        ))}
      </div>
    </Card>
  );
}
