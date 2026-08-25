/**
 * GenBrain — WatermelonDB Schema Definition
 *
 * Six tables for offline-first storage of all user data:
 * - users: Local user profile and preferences
 * - categories: Knowledge niches (Science, Tech, etc.)
 * - cards: Flashcard content (front/back/deep_dive)
 * - card_interactions: Spaced repetition tracking (SM-2)
 * - quiz_attempts: Quiz history and scores
 * - daily_streaks: Streak and XP logs
 */

import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
  version: 1,
  tables: [
    // ── Users ──────────────────────────────────────────────────────────
    tableSchema({
      name: "users",
      columns: [
        { name: "display_name", type: "string" },
        { name: "selected_niches", type: "string" }, // JSON array
        { name: "total_xp", type: "number" },
        { name: "current_streak", type: "number" },
        { name: "longest_streak", type: "number" },
        { name: "onboarded_at", type: "number" }, // timestamp
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // ── Categories ─────────────────────────────────────────────────────
    tableSchema({
      name: "categories",
      columns: [
        { name: "key", type: "string", isIndexed: true },
        { name: "label", type: "string" },
        { name: "glyph", type: "string" },
        { name: "is_selected", type: "boolean" },
        { name: "sort_order", type: "number" },
      ],
    }),

    // ── Cards (Flashcards) ─────────────────────────────────────────────
    tableSchema({
      name: "cards",
      columns: [
        { name: "category_id", type: "string", isIndexed: true },
        { name: "front", type: "string" },
        { name: "back", type: "string" },
        { name: "deep_dive", type: "string" },
        { name: "tag", type: "string" }, // display label
        { name: "source_url", type: "string", isOptional: true },
        { name: "source_name", type: "string", isOptional: true },
        { name: "published_date", type: "string" },
        { name: "created_at", type: "number" },
      ],
    }),

    // ── Card Interactions (Spaced Repetition Tracking) ──────────────────
    tableSchema({
      name: "card_interactions",
      columns: [
        { name: "card_id", type: "string", isIndexed: true },
        // 'viewed' | 'skipped' | 'asked_ai' | 'quizzed_correct' | 'quizzed_wrong'
        { name: "interaction_type", type: "string", isIndexed: true },
        { name: "duration_ms", type: "number" },
        // SM-2 algorithm fields
        { name: "ease_factor", type: "number" },    // default 2.5
        { name: "interval_days", type: "number" },  // days until next review
        { name: "repetitions", type: "number" },     // successful review count
        { name: "next_review_at", type: "number" },  // timestamp
        { name: "created_at", type: "number" },
      ],
    }),

    // ── Quiz Attempts ──────────────────────────────────────────────────
    tableSchema({
      name: "quiz_attempts",
      columns: [
        { name: "category_id", type: "string", isOptional: true, isIndexed: true },
        { name: "score", type: "number" },
        { name: "total", type: "number" },
        { name: "is_boss_battle", type: "boolean" },
        { name: "xp_earned", type: "number" },
        { name: "completed_at", type: "number" },
      ],
    }),

    // ── Daily Streaks ──────────────────────────────────────────────────
    tableSchema({
      name: "daily_streaks",
      columns: [
        { name: "date", type: "string", isIndexed: true }, // YYYY-MM-DD
        { name: "cards_read", type: "number" },
        { name: "quizzes_completed", type: "number" },
        { name: "xp_earned", type: "number" },
        { name: "streak_count", type: "number" },
      ],
    }),
  ],
});

// ═══════════════════════════════════════════════════════════════════════════
// TypeScript Interfaces — used throughout the app for type safety
// ═══════════════════════════════════════════════════════════════════════════

export interface IUser {
  id: string;
  displayName: string;
  selectedNiches: string[];
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  onboardedAt: number;
}

export interface ICategory {
  id: string;
  key: string;
  label: string;
  glyph: string;
  isSelected: boolean;
  sortOrder: number;
}

export interface ICard {
  id: string;
  categoryId: string;
  front: string;
  back: string;
  deepDive: string;
  tag: string;
  sourceUrl: string | null;
  sourceName: string | null;
  publishedDate: string;
  createdAt: number;
}

export interface ICardInteraction {
  id: string;
  cardId: string;
  interactionType:
    | "viewed"
    | "skipped"
    | "asked_ai"
    | "quizzed_correct"
    | "quizzed_wrong";
  durationMs: number;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: number;
  createdAt: number;
}

export interface IQuizAttempt {
  id: string;
  categoryId: string | null;
  score: number;
  total: number;
  isBossBattle: boolean;
  xpEarned: number;
  completedAt: number;
}

export interface IDailyStreak {
  id: string;
  date: string;
  cardsRead: number;
  quizzesCompleted: number;
  xpEarned: number;
  streakCount: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// Equivalent SQL (for reference / documentation)
// ═══════════════════════════════════════════════════════════════════════════
//
// CREATE TABLE users (
//   id TEXT PRIMARY KEY,
//   display_name TEXT NOT NULL,
//   selected_niches TEXT NOT NULL DEFAULT '[]',  -- JSON array
//   total_xp INTEGER NOT NULL DEFAULT 0,
//   current_streak INTEGER NOT NULL DEFAULT 0,
//   longest_streak INTEGER NOT NULL DEFAULT 0,
//   onboarded_at INTEGER NOT NULL,
//   created_at INTEGER NOT NULL,
//   updated_at INTEGER NOT NULL
// );
//
// CREATE TABLE categories (
//   id TEXT PRIMARY KEY,
//   key TEXT NOT NULL UNIQUE,
//   label TEXT NOT NULL,
//   glyph TEXT NOT NULL,
//   is_selected INTEGER NOT NULL DEFAULT 0,
//   sort_order INTEGER NOT NULL DEFAULT 0
// );
// CREATE INDEX idx_categories_key ON categories(key);
//
// CREATE TABLE cards (
//   id TEXT PRIMARY KEY,
//   category_id TEXT NOT NULL REFERENCES categories(id),
//   front TEXT NOT NULL,
//   back TEXT NOT NULL,
//   deep_dive TEXT NOT NULL,
//   tag TEXT NOT NULL,
//   source_url TEXT,
//   source_name TEXT,
//   published_date TEXT NOT NULL,
//   created_at INTEGER NOT NULL
// );
// CREATE INDEX idx_cards_category ON cards(category_id);
//
// CREATE TABLE card_interactions (
//   id TEXT PRIMARY KEY,
//   card_id TEXT NOT NULL REFERENCES cards(id),
//   interaction_type TEXT NOT NULL CHECK(
//     interaction_type IN ('viewed','skipped','asked_ai','quizzed_correct','quizzed_wrong')
//   ),
//   duration_ms INTEGER NOT NULL DEFAULT 0,
//   ease_factor REAL NOT NULL DEFAULT 2.5,
//   interval_days INTEGER NOT NULL DEFAULT 0,
//   repetitions INTEGER NOT NULL DEFAULT 0,
//   next_review_at INTEGER NOT NULL DEFAULT 0,
//   created_at INTEGER NOT NULL
// );
// CREATE INDEX idx_interactions_card ON card_interactions(card_id);
// CREATE INDEX idx_interactions_type ON card_interactions(interaction_type);
//
// CREATE TABLE quiz_attempts (
//   id TEXT PRIMARY KEY,
//   category_id TEXT REFERENCES categories(id),
//   score INTEGER NOT NULL,
//   total INTEGER NOT NULL,
//   is_boss_battle INTEGER NOT NULL DEFAULT 0,
//   xp_earned INTEGER NOT NULL DEFAULT 0,
//   completed_at INTEGER NOT NULL
// );
//
// CREATE TABLE daily_streaks (
//   id TEXT PRIMARY KEY,
//   date TEXT NOT NULL UNIQUE,
//   cards_read INTEGER NOT NULL DEFAULT 0,
//   quizzes_completed INTEGER NOT NULL DEFAULT 0,
//   xp_earned INTEGER NOT NULL DEFAULT 0,
//   streak_count INTEGER NOT NULL DEFAULT 0
// );
// CREATE INDEX idx_streaks_date ON daily_streaks(date);
