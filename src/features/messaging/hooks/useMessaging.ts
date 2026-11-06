'use client';

import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { createInfiniteQueryOptions } from '@/lib/infinite-query';
import { messagingService } from '../api/messaging.service';
import { MESSAGING_QUERY_KEYS } from '../lib/query-keys';
import type {
  ChatMessage,
  Conversation,
  ConversationListResponse,
  MessageListResponse,
} from '../types';

export function useConversations(limit = 20) {
  return useInfiniteQuery(
    createInfiniteQueryOptions<Conversation, ConversationListResponse>({
      queryKey: MESSAGING_QUERY_KEYS.conversations,
      fetchPage: (page, pageLimit) => messagingService.getConversations(page, pageLimit),
      limit,
      getItems: (response) => response.conversations,
      getPagination: (response) => response.pagination,
    })
  );
}

export function flattenConversationPages(
  data: InfiniteData<ConversationListResponse> | undefined
): Conversation[] {
  return data?.pages.flatMap((page) => page.conversations ?? []) ?? [];
}

export function useMessages(conversationId?: string, limit = 30) {
  return useInfiniteQuery({
    ...createInfiniteQueryOptions<ChatMessage, MessageListResponse>({
      queryKey: MESSAGING_QUERY_KEYS.messages(conversationId ?? 'none'),
      fetchPage: (page, pageLimit) =>
        messagingService.getMessages(conversationId as string, page, pageLimit),
      limit,
      enabled: !!conversationId,
      getItems: (response) => response.messages,
      getPagination: (response) => response.pagination,
    }),
  });
}

/**
 * The API returns messages newest-first within each page. Reversing both the
 * pages and their contents gives the thread a chronological top-to-bottom order.
 */
export function flattenMessagePages(
  data: InfiniteData<MessageListResponse> | undefined
): ChatMessage[] {
  if (!data) return [];
  return [...data.pages]
    .reverse()
    .flatMap((page) => [...(page.messages ?? [])].reverse());
}

export function useUnreadCount() {
  return useQuery({
    queryKey: MESSAGING_QUERY_KEYS.unreadCount,
    queryFn: () => messagingService.getUnreadCount(),
    select: (data) => data.count,
    staleTime: 30_000,
  });
}

export function useSendMessage(conversationId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      messagingService.sendMessage(conversationId as string, content),
    onSuccess: ({ message }) => {
      if (!conversationId) return;

      queryClient.setQueriesData<InfiniteData<MessageListResponse>>(
        { queryKey: MESSAGING_QUERY_KEYS.messages(conversationId) },
        (current) => {
          if (!current || !current.pages?.length) return current;

          const [firstPage, ...rest] = current.pages;
          if (!firstPage) return current;
          if (firstPage.messages.some((item) => item.id === message.id)) return current;

          return {
            ...current,
            pages: [
              {
                ...firstPage,
                messages: [message, ...firstPage.messages],
                pagination: {
                  ...firstPage.pagination,
                  totalCount: (firstPage.pagination?.totalCount ?? 0) + 1,
                },
              },
              ...rest,
            ],
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: MESSAGING_QUERY_KEYS.conversations });
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });
}

export function useMarkConversationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) =>
      messagingService.markConversationRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGING_QUERY_KEYS.conversations });
    },
  });
}

export function useCreateDirectConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (participantId: string) =>
      messagingService.createDirectConversation(participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGING_QUERY_KEYS.conversations });
    },
    onError: () => {
      toast.error('Failed to start conversation');
    },
  });
}
