'use client';

import { useMemo, useState } from 'react';
import { BadgeCheck, MessageCircle, Search, SquarePen } from 'lucide-react';
import { UserAvatar } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  cn,
  formatCount,
  formatRelativeTime,
  getAvatarPalette,
  getInitials,
} from '@/lib/utils';
import { getConversationPartner, getConversationTitle } from '../lib/conversation';
import type { Conversation } from '../types';

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId?: string;
  selectedId?: string | null;
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  onSelect: (conversation: Conversation) => void;
  onNewConversation: () => void;
  className?: string;
}

function ConversationRowSkeleton() {
  return (
    <div className="flex items-start gap-3 px-3 py-3">
      <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
  );
}

export function ConversationList({
  conversations,
  currentUserId,
  selectedId,
  unreadCount,
  isLoading,
  isError,
  onRetry,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onSelect,
  onNewConversation,
  className,
}: ConversationListProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return conversations;

    return conversations.filter((conversation) => {
      const partner = getConversationPartner(conversation, currentUserId);
      const haystack = [
        partner?.displayName,
        partner?.username,
        conversation.lastMessage?.content,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [conversations, currentUserId, query]);

  return (
    <aside
      className={cn(
        'h-full min-h-0 flex-col overflow-hidden bg-background sm:rounded-md sm:border sm:border-border sm:bg-card sm:shadow-[0_12px_45px_rgb(0,0,0,0.04)]',
        className
      )}
    >
      <div className="shrink-0 px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-vivid-blue/10 text-vivid-blue">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black tracking-tight text-foreground">
                Messages
              </h1>
              <p className="truncate text-[11px] font-semibold text-muted-foreground">
                {unreadCount > 0
                  ? `${formatCount(unreadCount, { max: 99 })} unread`
                  : 'Your conversations'}
              </p>
            </div>
          </div>

          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  aria-label="New message"
                  onClick={onNewConversation}
                  className="rounded-full text-foreground hover:bg-vivid-blue hover:text-white transition-colors"
                >
                  <SquarePen className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">New message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conversations"
            aria-label="Search conversations"
            className="h-10 rounded-xl border-border/70 bg-secondary/40 pl-9 text-[13px] font-medium shadow-none focus-visible:ring-vivid-blue/20"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-1.5 sm:py-2">
        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 6 }).map((_, index) => (
              <ConversationRowSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vivid-red/10 text-vivid-red">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Could not load messages</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Check your connection and try again.
              </p>
            </div>
            <Button size="sm" variant="secondary" onClick={onRetry}>
              Try again
            </Button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vivid-blue/10 text-vivid-blue">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">No conversations yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Start a chat with someone you follow.
              </p>
            </div>
            <Button size="sm" onClick={onNewConversation} className="bg-vivid-blue text-white">
              New message
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <Search className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-bold text-foreground">No matches</p>
            <p className="text-xs text-muted-foreground">
              Try a different name or keyword.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((conversation) => {
              const partner = getConversationPartner(conversation, currentUserId);
              const title = getConversationTitle(conversation, currentUserId);
              const isSelected = conversation.id === selectedId;
              const unread = conversation.unreadCount > 0;
              const lastMessage = conversation.lastMessage;
              const preview = lastMessage
                ? `${lastMessage.senderId === currentUserId ? 'You: ' : ''}${lastMessage.content}`
                : 'No messages yet';
              const time = formatRelativeTime(
                lastMessage?.createdAt || conversation.updatedAt || conversation.createdAt
              );
              const palette = getAvatarPalette(partner?.username || title);

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => onSelect(conversation)}
                  className={cn(
                    'relative flex w-full items-start gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors sm:rounded-2xl sm:px-3 sm:py-3',
                    isSelected ? 'bg-vivid-blue/6' : 'hover:bg-secondary/60'
                  )}
                >
                  {isSelected && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-full bg-vivid-blue" />
                  )}

                  <UserAvatar
                    src={partner?.avatarUrl}
                    alt={title}
                    fallback={getInitials(title)}
                    size="lg"
                    className="h-10 w-10 sm:h-11 sm:w-11"
                    imageClassName="object-cover"
                    fallbackClassName={cn(palette.bg, palette.text, 'font-semibold')}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1">
                        <p className="truncate text-[13px] font-bold text-foreground">{title}</p>
                        {partner?.isVerified && (
                          <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-vivid-blue" />
                        )}
                      </div>
                      <span className="shrink-0 text-[10px] font-semibold text-muted-foreground sm:text-[10.5px]">
                        {time}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          'truncate text-[11.5px] sm:text-[12px]',
                          unread
                            ? 'font-semibold text-foreground'
                            : 'font-medium text-muted-foreground'
                        )}
                      >
                        {preview}
                      </p>
                      {unread && (
                        <span className="flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-vivid-blue px-1.5 text-[10px] font-bold text-white">
                          {formatCount(conversation.unreadCount, { max: 99 })}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {hasNextPage && (
        <div className="shrink-0 border-t border-border/70 p-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="w-full rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load more conversations'}
          </Button>
        </div>
      )}

    </aside>
  );
}
