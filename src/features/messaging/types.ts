export interface MessagingUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isVerified: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  sender: MessagingUser;
}

export interface Conversation {
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  participants: MessagingUser[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export interface MessagingPagination {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  pagination: MessagingPagination;
}

export interface ConversationResponse {
  conversation: Conversation;
}

export interface MessageListResponse {
  messages: ChatMessage[];
  pagination: MessagingPagination;
}

export interface MessageResponse {
  message: ChatMessage;
}

export interface MarkConversationReadResponse {
  success: boolean;
}

export interface UnreadCountResponse {
  count: number;
}
