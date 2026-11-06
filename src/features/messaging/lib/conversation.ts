import type { Conversation, MessagingUser } from '../types';

export function getConversationPartner(
  conversation: Conversation,
  currentUserId?: string
): MessagingUser | undefined {
  if (!conversation.participants.length) return undefined;

  if (currentUserId) {
    return (
      conversation.participants.find((participant) => participant.id !== currentUserId) ??
      conversation.participants[0]
    );
  }

  return conversation.participants[0];
}

export function getConversationTitle(
  conversation: Conversation,
  currentUserId?: string
): string {
  const partner = getConversationPartner(conversation, currentUserId);
  return partner?.displayName || partner?.username || 'Conversation';
}
