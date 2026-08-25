/**
 * GenBrain — Kihoro Chat State Store (Zustand)
 *
 * Manages the AI tutor's conversation state:
 * - Message history with unique IDs (short-term, per-session)
 * - Typing indicator
 * - Current card context
 *
 * NOT persisted — chat history resets when the modal closes.
 */

import { create } from "zustand";
import type { CardData } from "./useCardStore";

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
}

interface ChatState {
  // State
  messages: ChatMessage[];
  isTyping: boolean;
  cardContext: CardData | null;
  isOpen: boolean;

  // Actions
  openChat: (card: CardData) => void;
  closeChat: () => void;
  addUserMessage: (text: string) => void;
  addAIMessage: (text: string) => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isTyping: false,
  cardContext: null,
  isOpen: false,

  openChat: (card) => {
    set({
      isOpen: true,
      cardContext: card,
      messages: [
        {
          id: `init-${Date.now()}`,
          role: "ai",
          text: `Hi, I'm Kihoro. Ask me anything about this ${card.tag.toLowerCase()} fact — ${card.deepDive} What would you like to know?`,
        },
      ],
      isTyping: false,
    });
  },

  closeChat: () =>
    set({
      isOpen: false,
      messages: [],
      cardContext: null,
      isTyping: false,
    }),

  addUserMessage: (text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, role: "user", text },
      ],
    })),

  addAIMessage: (text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, role: "ai", text },
      ],
      isTyping: false,
    })),

  setTyping: (typing) => set({ isTyping: typing }),

  clearMessages: () => set({ messages: [] }),
}));
