/**
 * GenBrain — AI Tutor (Kihoro) Hook
 *
 * Manages communication with the local Ollama instance via the backend,
 * with fallback to a simple pattern-matching responder when offline.
 */

import { useCallback } from "react";
import { useChatStore, type ChatMessage } from "../store/useChatStore";
import type { CardData } from "../store/useCardStore";
import { sendTutorMessage } from "../lib/api";

/**
 * Offline fallback: simple keyword-based responses using the card context.
 * This mirrors the prototype's deepReply() function.
 */
function offlineReply(question: string, card: CardData): string {
  const q = question.toLowerCase();
  if (q.includes("why") || q.includes("how")) {
    return `${card.deepDive} Does that clear up the "how" behind it?`;
  }
  if (q.includes("example") || q.includes("like")) {
    return `Think of it this way: ${card.back} ${card.deepDive.split(". ")[0]}.`;
  }
  if (q.includes("more") || q.includes("detail")) {
    return card.deepDive;
  }
  if (q.includes("simple") || q.includes("explain")) {
    return `In simple terms: ${card.back}`;
  }
  return `Good question. In the context of "${card.tag}": ${card.deepDive.split(". ")[0]}. Want me to go deeper or simpler?`;
}

export function useAITutor() {
  const messages = useChatStore((s) => s.messages);
  const isTyping = useChatStore((s) => s.isTyping);
  const cardContext = useChatStore((s) => s.cardContext);
  const isOpen = useChatStore((s) => s.isOpen);
  const openChat = useChatStore((s) => s.openChat);
  const closeChat = useChatStore((s) => s.closeChat);
  const addUserMessage = useChatStore((s) => s.addUserMessage);
  const addAIMessage = useChatStore((s) => s.addAIMessage);
  const setTyping = useChatStore((s) => s.setTyping);

  /** Generate suggestion chips based on the current card */
  const getSuggestions = useCallback((): string[] => {
    if (!cardContext) return [];
    const firstNoun = (cardContext.deepDive.match(/\b([A-Z][a-z]+)\b/g) || [])[0] ?? cardContext.tag;
    return [
      "Explain it simply",
      "Why is that the case?",
      `What about ${firstNoun}?`,
      "Give me an example",
      "Go deeper",
    ];
  }, [cardContext]);

  /** Send a message to the AI tutor */
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !cardContext) return;

      addUserMessage(trimmed);
      setTyping(true);

      try {
        // Try the backend (which proxies to Ollama)
        const result = await sendTutorMessage(
          {
            front: cardContext.front,
            back: cardContext.back,
            deep_dive: cardContext.deepDive,
            category: cardContext.tag,
          },
          trimmed,
          messages.map((m) => ({ role: m.role, text: m.text }))
        );

        if (result.success && result.data?.response) {
          addAIMessage(result.data.response);
        } else {
          // API failed — use offline fallback
          const reply = offlineReply(trimmed, cardContext);
          addAIMessage(reply);
        }
      } catch {
        // Network error — use offline fallback
        const reply = offlineReply(trimmed, cardContext);
        addAIMessage(reply);
      }
    },
    [cardContext, messages, addUserMessage, addAIMessage, setTyping]
  );

  return {
    messages,
    isTyping,
    isOpen,
    cardContext,
    openChat,
    closeChat,
    sendMessage,
    getSuggestions,
  };
}
