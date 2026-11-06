'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import {
  ChatHeader,
  ConversationList,
  EmptyThread,
  MessageComposer,
  MessageThread,
  NewConversationDialog,
} from '@/features/messaging/components';
import {
  flattenConversationPages,
  flattenMessagePages,
  useConversations,
  useMarkConversationRead,
  useMessages,
  useSendMessage,
  useUnreadCount,
} from '@/features/messaging/hooks/useMessaging';
import {
  getConversationPartner,
  getConversationTitle,
} from '@/features/messaging/lib/conversation';
import { useMessagingStore } from '@/features/messaging/store';
import type { Conversation } from '@/features/messaging/types';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const { data: currentUser } = useCurrentUser();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    () => useMessagingStore.getState().pendingConversation
  );
  const [newConversationOpen, setNewConversationOpen] = useState(false);

  useEffect(() => {
    useMessagingStore.getState().setPendingConversation(null);
  }, []);

  const conversationsQuery = useConversations();
  const conversations = useMemo(
    () => flattenConversationPages(conversationsQuery.data),
    [conversationsQuery.data]
  );
  const { data: unreadCount = 0 } = useUnreadCount();

  const activeConversation = useMemo(() => {
    if (!selectedConversation) return null;
    return (
      conversations.find((conversation) => conversation.id === selectedConversation.id) ??
      selectedConversation
    );
  }, [conversations, selectedConversation]);

  const activeConversationId = activeConversation?.id;
  const messagesQuery = useMessages(activeConversationId);
  const messages = useMemo(
    () => flattenMessagePages(messagesQuery.data),
    [messagesQuery.data]
  );
  const sendMessage = useSendMessage(activeConversationId);
  const { mutate: markConversationRead } = useMarkConversationRead();

  const partner = activeConversation
    ? getConversationPartner(activeConversation, currentUser?.id)
    : undefined;
  const title = activeConversation
    ? getConversationTitle(activeConversation, currentUser?.id)
    : '';
  const latestMessageId =
    messages.length > 0 ? messages[messages.length - 1].id : undefined;

  useEffect(() => {
    if (!activeConversationId || !latestMessageId) return;

    const markReadIfVisible = () => {
      if (document.visibilityState !== 'visible') return;
      markConversationRead(activeConversationId);
    };

    markReadIfVisible();
    document.addEventListener('visibilitychange', markReadIfVisible);

    return () => {
      document.removeEventListener('visibilitychange', markReadIfVisible);
    };
  }, [activeConversationId, latestMessageId, markConversationRead]);

  const handleSend = (content: string) => sendMessage.mutateAsync(content);

  return (
    <div className="mx-auto min-w-0 max-w-312.5 animate-fade-in-up px-0 py-0 sm:p-6 lg:h-[calc(100svh-3.5rem)]">
      <div className="grid h-[calc(100dvh-3.5rem)] grid-cols-1 gap-0 sm:h-[calc(100dvh-6.5rem)] sm:gap-6 lg:h-full lg:grid-cols-[360px_minmax(0,1fr)]">
        <ConversationList
          conversations={conversations}
          currentUserId={currentUser?.id}
          selectedId={activeConversationId}
          unreadCount={unreadCount}
          isLoading={conversationsQuery.isLoading}
          isError={conversationsQuery.isError}
          onRetry={() => {
            void conversationsQuery.refetch();
          }}
          hasNextPage={!!conversationsQuery.hasNextPage}
          isFetchingNextPage={conversationsQuery.isFetchingNextPage}
          onLoadMore={() => {
            void conversationsQuery.fetchNextPage();
          }}
          onSelect={setSelectedConversation}
          onNewConversation={() => setNewConversationOpen(true)}
          className={activeConversation ? 'hidden lg:flex' : 'flex'}
        />

        <section
          className={cn(
            'h-full min-h-0 flex-col gap-0 sm:gap-4',
            activeConversation ? 'flex' : 'hidden lg:flex'
          )}
        >
          {activeConversation ? (
            <>
              <ChatHeader
                partner={partner}
                title={title}
                onBack={() => setSelectedConversation(null)}
              />

              <MessageThread
                key={`thread-${activeConversation.id}`}
                conversationId={activeConversation.id}
                messages={messages}
                currentUserId={currentUser?.id}
                isLoading={messagesQuery.isLoading}
                isError={messagesQuery.isError}
                onRetry={() => {
                  void messagesQuery.refetch();
                }}
                hasNextPage={!!messagesQuery.hasNextPage}
                isFetchingNextPage={messagesQuery.isFetchingNextPage}
                onLoadOlder={() => messagesQuery.fetchNextPage()}
              />

              <MessageComposer
                key={`composer-${activeConversation.id}`}
                onSend={handleSend}
                isSending={sendMessage.isPending}
              />
            </>
          ) : (
            <EmptyThread onNewConversation={() => setNewConversationOpen(true)} />
          )}
        </section>
      </div>

      <NewConversationDialog
        open={newConversationOpen}
        onOpenChange={setNewConversationOpen}
        currentUserId={currentUser?.id}
        onCreated={setSelectedConversation}
      />
    </div>
  );
}
