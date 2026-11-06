export const MESSAGING_QUERY_KEYS = {
  conversations: ['conversations'] as const,
  unreadCount: ['conversations', 'unread-count'] as const,
  messages: (conversationId: string) => ['messages', conversationId] as const,
};
