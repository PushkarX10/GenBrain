/**
 * GenBrain — Backend API Client
 *
 * HTTP client for communicating with the FastAPI backend.
 * All requests go through this module for consistent error handling.
 */

import { useSettingsStore } from "../store/useSettingsStore";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Make an API request to the backend.
 */
async function request<T>(
  method: HttpMethod,
  path: string,
  body?: Record<string, unknown>,
  params?: Record<string, string>
): Promise<ApiResponse<T>> {
  const { backendUrl } = useSettingsStore.getState();
  let url = `${backendUrl}${path}`;

  // Append query params for GET requests
  if (params) {
    const qs = new URLSearchParams(params).toString();
    url += `?${qs}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = (await response.json()) as T;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// API Methods
// ═══════════════════════════════════════════════════════════════════════════

/** Check backend health and Ollama connectivity */
export async function checkHealth() {
  return request<{ status: string; ollama: boolean; model: string }>(
    "GET",
    "/health"
  );
}

/** Fetch daily news articles */
export async function fetchDailyNews(niches: string[]) {
  return request<{ date: string; cards?: any[]; articles?: any[]; source: string }>(
    "GET",
    "/api/news/daily",
    undefined,
    { niches: niches.join(",") }
  );
}

/** Generate a flashcard from article text */
export async function generateFlashcard(articleText: string, category: string) {
  return request<{
    success: boolean;
    flashcard?: { front: string; back: string; deep_dive: string };
    error?: string;
  }>("POST", "/api/flashcards/generate", {
    article_text: articleText,
    category,
  });
}

/** Send a message to the Kihoro AI Tutor */
export async function sendTutorMessage(
  cardContext: {
    front: string;
    back: string;
    deep_dive: string;
    category: string;
  },
  userMessage: string,
  conversationHistory: { role: string; text: string }[]
) {
  return request<{
    success: boolean;
    response: string;
    conversation_history: { role: string; text: string }[];
    error?: string;
  }>("POST", "/api/chat/tutor", {
    card_context: cardContext,
    user_message: userMessage,
    conversation_history: conversationHistory,
  });
}

/** Generate a quiz question with LLM distractors */
export async function generateQuizQuestion(
  correctAnswer: string,
  topicContext: string,
  category: string
) {
  return request<{
    success: boolean;
    question?: {
      subject: string;
      question: string;
      options: { key: string; text: string }[];
      correct: string;
    };
    error?: string;
  }>("POST", "/api/quiz/generate", {
    correct_answer: correctAnswer,
    topic_context: topicContext,
    category,
  });
}

