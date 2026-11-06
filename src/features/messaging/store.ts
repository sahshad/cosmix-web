import { create } from 'zustand';
import type { Conversation } from './types';

type MessagingState = {
  pendingConversation: Conversation | null;
  setPendingConversation: (conversation: Conversation | null) => void;
};

export const useMessagingStore = create<MessagingState>((set) => ({
  pendingConversation: null,
  setPendingConversation: (conversation) => set({ pendingConversation: conversation }),
}));
