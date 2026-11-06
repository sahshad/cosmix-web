'use client';

import Link from 'next/link';
import { BadgeCheck, ChevronLeft } from 'lucide-react';
import { UserAvatar } from '@/components/shared';
import { cn, getAvatarPalette, getInitials } from '@/lib/utils';
import type { MessagingUser } from '../types';

interface ChatHeaderProps {
  partner?: MessagingUser;
  title: string;
  onBack: () => void;
}

export function ChatHeader({ partner, title, onBack }: ChatHeaderProps) {
  const palette = getAvatarPalette(partner?.username || title);
  const profileHref = partner?.username ? `/profile/${partner.username}` : undefined;

  return (
    <header className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border bg-background px-3 sm:h-16 sm:rounded-md sm:border sm:bg-card sm:px-4 sm:shadow-[0_12px_45px_rgb(0,0,0,0.04)]">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to conversations"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:h-9 sm:w-9 lg:hidden"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <UserAvatar
        src={partner?.avatarUrl}
        alt={title}
        fallback={getInitials(title)}
        size="md"
        imageClassName="object-cover"
        fallbackClassName={cn(palette.bg, palette.text, 'font-semibold')}
      />

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1.5">
          {profileHref ? (
            <Link
              href={profileHref}
              className="truncate text-[13.5px] font-bold text-foreground hover:underline sm:text-[14px]"
            >
              {title}
            </Link>
          ) : (
            <p className="truncate text-[13.5px] font-bold text-foreground sm:text-[14px]">{title}</p>
          )}
          {partner?.isVerified && (
            <BadgeCheck className="h-4 w-4 shrink-0 text-vivid-blue" />
          )}
        </div>
        {partner?.username && (
          <p className="truncate text-[11px] font-medium text-muted-foreground sm:text-[11.5px]">
            @{partner.username}
          </p>
        )}
      </div>

      <span className="hidden shrink-0 rounded-full bg-vivid-blue/10 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-vivid-blue sm:inline-flex">
        Direct
      </span>
    </header>
  );
}
