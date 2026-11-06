'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { BadgeCheck, ChevronRight, Search, UsersRound } from 'lucide-react';
import { Spinner, UserAvatar } from '@/components/shared';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFollowing } from '@/features/profile/hooks/useUser';
import {
  cn,
  getAvatarPalette,
  getInitials,
} from '@/lib/utils';
import { useCreateDirectConversation } from '../hooks/useMessaging';
import type { Conversation } from '../types';

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId?: string;
  onCreated: (conversation: Conversation) => void;
}

export function NewConversationDialog({
  open,
  onOpenChange,
  currentUserId,
  onCreated,
}: NewConversationDialogProps) {
  const [query, setQuery] = useState('');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const { data: following = [], isLoading, isError, refetch } = useFollowing(
    open ? currentUserId : undefined
  );
  const createConversation = useCreateDirectConversation();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setQuery('');
      setPendingId(null);
    }
    onOpenChange(nextOpen);
  };

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return following;

    return following.filter((user) =>
      [user.displayName, user.username].filter(Boolean).join(' ').toLowerCase().includes(term)
    );
  }, [following, query]);

  const handleStart = (participantId: string) => {
    if (pendingId) return;

    setPendingId(participantId);
    createConversation.mutate(participantId, {
      onSuccess: ({ conversation }) => {
        if (conversation) {
          onCreated(conversation);
          handleOpenChange(false);
        }
        setPendingId(null);
      },
      onError: () => setPendingId(null),
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border/70 px-5 py-4 pr-12">
          <DialogTitle>New message</DialogTitle>
          <DialogDescription>
            Pick someone you follow to start a conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="border-b border-border/70 p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search people you follow"
              aria-label="Search people you follow"
              className="h-10 rounded-xl bg-secondary/40 pl-9 text-[13px] font-medium shadow-none focus-visible:ring-vivid-blue/20"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2" style={{ maxHeight: '22rem' }}>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" className="text-vivid-blue" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <p className="text-sm font-bold text-foreground">Could not load people</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-xs font-semibold text-vivid-blue hover:underline"
              >
                Try again
              </button>
            </div>
          ) : following.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vivid-blue/10 text-vivid-blue">
                <UsersRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">No one to message yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Follow people and they will show up here.
                </p>
              </div>
              <Link
                href="/explore"
                onClick={() => onOpenChange(false)}
                className="text-xs font-bold text-vivid-blue hover:underline"
              >
                Find people to follow
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
              <Search className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm font-bold text-foreground">No matches</p>
              <p className="text-xs text-muted-foreground">Try a different name.</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filtered.map((user) => {
                const palette = getAvatarPalette(user.username || user.displayName);
                const isPending = pendingId === user.id;

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleStart(user.id)}
                    disabled={!!pendingId}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors',
                      'hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60'
                    )}
                  >
                    <UserAvatar
                      src={user.avatarUrl}
                      alt={user.displayName}
                      fallback={getInitials(user.displayName)}
                      size="md"
                      imageClassName="object-cover"
                      fallbackClassName={cn(palette.bg, palette.text, 'font-semibold')}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <p className="truncate text-[13px] font-bold text-foreground">
                          {user.displayName}
                        </p>
                        {user.isVerified && (
                          <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-vivid-blue" />
                        )}
                      </div>
                      <p className="truncate text-[11.5px] font-medium text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>

                    {isPending ? (
                      <Spinner size="sm" className="text-vivid-blue" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
