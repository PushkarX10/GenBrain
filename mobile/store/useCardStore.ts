/**
 * GenBrain — Card Deck State Store (Zustand)
 *
 * Manages the current flashcard deck state:
 * - Current card index
 * - Flip state (front/back)
 * - Drag/swipe offset
 * - Seen cards tracking
 */

import { create } from "zustand";

export interface CardData {
  id: string;
  tag: string;
  front: string;
  back: string;
  deepDive: string;
  sourceUrl?: string;
  publishedDate?: string;
}

interface CardState {
  // Deck
  cards: CardData[];
  currentIndex: number;
  seenIds: Set<string>;

  // Interaction state
  isFlipped: boolean;
  dragOffset: number;

  // Actions
  setCards: (cards: CardData[]) => void;
  advance: (direction: 1 | -1) => boolean; // returns true if new card seen
  flip: () => void;
  resetFlip: () => void;
  setDragOffset: (offset: number) => void;
  getCurrentCard: () => CardData | null;
}

export const useCardStore = create<CardState>((set, get) => ({
  cards: [],
  currentIndex: 0,
  seenIds: new Set(),
  isFlipped: false,
  dragOffset: 0,

  setCards: (cards) =>
    set({
      cards,
      currentIndex: 0,
      seenIds: new Set(cards.length > 0 ? [cards[0].id] : []),
      isFlipped: false,
    }),

  advance: (direction) => {
    const state = get();
    if (state.cards.length === 0) return false;

    const nextIndex =
      (state.currentIndex + direction + state.cards.length) %
      state.cards.length;
    const nextCard = state.cards[nextIndex];
    const isNew = !state.seenIds.has(nextCard.id);

    const newSeen = new Set(state.seenIds);
    newSeen.add(nextCard.id);

    set({
      currentIndex: nextIndex,
      seenIds: newSeen,
      isFlipped: false,
      dragOffset: 0,
    });

    return isNew;
  },

  flip: () => set((s) => ({ isFlipped: !s.isFlipped })),
  resetFlip: () => set({ isFlipped: false }),
  setDragOffset: (offset) => set({ dragOffset: offset }),

  getCurrentCard: () => {
    const state = get();
    if (state.cards.length === 0) return null;
    return state.cards[state.currentIndex % state.cards.length];
  },
}));
