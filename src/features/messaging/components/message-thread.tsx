'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { ChevronUp, MessageCircle } from 'lucide-react';
import { Spinner, UserAvatar } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { cn, getAvatarPalette, getInitials } from '@/lib/utils';
import { formatMessageDate, formatMessageTime, isSameMessageDay } from '../lib/format';
import type { ChatMessage } from '../types';

const GROUP_WINDOW_MS = 5 * 60 * 1000;

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface MessageThreadProps {
  conversationId: string;
  messages: ChatMessage[];
  currentUserId?: string;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadOlder: () => Promise<unknown>;
}

export function MessageThread({
  conversationId,
  messages,
  currentUserId,
  isLoading,
  isError,
  onRetry,
  hasNextPage,
  isFetchingNextPage,
  onLoadOlder,
}: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialScrollConversationRef = useRef<string | null>(null);
  const pendingOlderDistanceRef = useRef<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || messages.length === 0) return;

    if (initialScrollConversationRef.current !== conversationId) {
      initialScrollConversationRef.current = conversationId;
      el.scrollTop = el.scrollHeight;
      return;
    }

    const lastMessage = messages[messages.length - 1];
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < 180 || lastMessage.senderId === currentUserId) {
      el.scrollTop = el.scrollHeight;
    }
  }, [conversationId, messages, currentUserId]);

  useIsomorphicLayoutEffect(() => {
    const el = scrollRef.current;
    const distanceFromBottom = pendingOlderDistanceRef.current;
    if (!el || distanceFromBottom === null) return;

    pendingOlderDistanceRef.current = null;
    el.scrollTop = el.scrollHeight - el.clientHeight - distanceFromBottom;
  }, [messages]);

  const handleLoadOlder = async () => {
    const el = scrollRef.current;
    if (!el) return;

    pendingOlderDistanceRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight;

    try {
      await onLoadOlder();
    } catch {
      pendingOlderDistanceRef.current = null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <Spinner size="xl" className="text-vivid-blue" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vivid-red/10 text-vivid-red">
          <MessageCircle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Could not load this conversation</p>
          <p className="mt-1 text-xs text-muted-foreground">Please try again.</p>
        </div>
        <Button size="sm" variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-vivid-blue/10 text-vivid-blue">
          <MessageCircle className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">No messages yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Send the first message to start the conversation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-linear-to-b from-vivid-blue/4 via-transparent to-transparent px-3 py-2 sm:px-4"
    >
      {hasNextPage && (
        <div className="mb-3 flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLoadOlder}
            disabled={isFetchingNextPage}
            className="h-8 rounded-full bg-card/80 px-3 text-[11px] font-semibold text-muted-foreground shadow-sm ring-1 ring-border/70 hover:text-foreground"
          >
            {isFetchingNextPage ? (
              <Spinner size="sm" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5" />
            )}
            Load earlier messages
          </Button>
        </div>
      )}

      <div className="space-y-1.5">
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const next = messages[index + 1];
          const isOwn = message.senderId === currentUserId;
          const sender = message.sender;
          const senderName = sender?.displayName || sender?.username || 'Unknown';
          const showDate =
            !previous || !isSameMessageDay(previous.createdAt, message.createdAt);

          const sameSenderAsPrevious = previous?.senderId === message.senderId;
          const withinPreviousWindow = previous
            ? new Date(message.createdAt).getTime() -
                new Date(previous.createdAt).getTime() <=
              GROUP_WINDOW_MS
            : false;
          const isGroupStart =
            !previous || !sameSenderAsPrevious || !withinPreviousWindow || showDate;

          const sameSenderAsNext = next?.senderId === message.senderId;
          const withinNextWindow = next
            ? new Date(next.createdAt).getTime() -
                new Date(message.createdAt).getTime() <=
              GROUP_WINDOW_MS
            : false;
          const isGroupEnd =
            !next ||
            !sameSenderAsNext ||
            !withinNextWindow ||
            !isSameMessageDay(message.createdAt, next.createdAt);

          const palette = getAvatarPalette(sender?.username || senderName);

          return (
            <div key={message.id}>
              {showDate && (
                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border/60" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {formatMessageDate(message.createdAt)}
                  </span>
                  <div className="h-px flex-1 bg-border/60" />
                </div>
              )}

              <div
                className={cn(
                  'flex items-end gap-2.5',
                  isOwn ? 'justify-end' : 'justify-start'
                )}
              >
                {!isOwn &&
                  (isGroupStart ? (
                    <UserAvatar
                      src={sender?.avatarUrl}
                      alt={senderName}
                      fallback={getInitials(senderName)}
                      size="sm"
                      className="mb-0.5 h-7 w-7"
                      imageClassName="object-cover"
                      fallbackClassName={cn(palette.bg, palette.text, 'text-[10px] font-semibold')}
                    />
                  ) : (
                    <div className="h-7 w-7 shrink-0" />
                  ))}

                <div
                  className={cn(
                    'flex max-w-[82%] min-w-0 flex-col sm:max-w-[72%]',
                    isOwn ? 'items-end' : 'items-start'
                  )}
                >
                  {!isOwn && isGroupStart && (
                    <span className="mb-1 px-1 text-[11px] font-bold text-foreground">
                      {senderName}
                    </span>
                  )}

                  <div
                    title={new Date(message.createdAt).toLocaleString()}
                    className={cn(
                      'whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed sm:px-4 sm:py-2.5',
                      isOwn
                        ? 'rounded-br-md bg-vivid-blue text-white shadow-md shadow-vivid-blue/15'
                        : 'rounded-bl-md border border-border bg-card text-foreground shadow-[0_4px_16px_rgb(0,0,0,0.04)]'
                    )}
                  >
                    {message.content}
                  </div>

                  {isGroupEnd && (
                    <span className="mt-1 px-1 text-[10px] font-medium text-muted-foreground">
                      {formatMessageTime(message.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
