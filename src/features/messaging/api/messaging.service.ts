import { http } from '@/lib/http';
import type {
  ConversationListResponse,
  ConversationResponse,
  MarkConversationReadResponse,
  MessageListResponse,
  MessageResponse,
  UnreadCountResponse,
} from '../types';

export const messagingService = {
  getConversations: (page = 1, limit = 20) =>
    http.get<ConversationListResponse>(`/conversations?page=${page}&limit=${limit}`),

  getConversation: (conversationId: string) =>
    http.get<ConversationResponse>(`/conversations/${conversationId}`),

  getMessages: (conversationId: string, page = 1, limit = 30) =>
    http.get<MessageListResponse>(
      `/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
    ),

  sendMessage: (conversationId: string, content: string) =>
    http.post<MessageResponse>(`/conversations/${conversationId}/messages`, {
      content,
    }),

  markConversationRead: (conversationId: string) =>
    http.patch<MarkConversationReadResponse>(`/conversations/${conversationId}/read`),

  getUnreadCount: () => http.get<UnreadCountResponse>('/conversations/unread-count'),

  createDirectConversation: (participantId: string) =>
    http.post<ConversationResponse>('/conversations/direct', { participantId }),
};
