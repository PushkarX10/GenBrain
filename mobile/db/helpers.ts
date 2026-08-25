/**
 * GenBrain — Database Query Helpers
 *
 * Convenience functions for common database operations:
 * - Fetching cards by category
 * - Recording interactions
 * - Querying weaknesses for Boss Battle
 * - Streak management
 */

import { Q } from "@nozbe/watermelondb";
import database from "./index";
import type { InteractionType } from "./models/CardInteraction";

// ═══════════════════════════════════════════════════════════════════════════
// Card Queries
// ═══════════════════════════════════════════════════════════════════════════

/** Get all cards for a specific category */
export async function getCardsByCategory(categoryKey: string) {
  return database
    .get("cards")
    .query(Q.where("tag", Q.eq(categoryKey)))
    .fetch();
}

/** Get cards due for review (spaced repetition) */
export async function getDueCards(now: number = Date.now()) {
  const interactions = await database
    .get("card_interactions")
    .query(Q.where("next_review_at", Q.lte(now)))
    .fetch();

  const cardIds = [...new Set(interactions.map((i: any) => i.cardId))];
  if (cardIds.length === 0) return [];

  return database
    .get("cards")
    .query(Q.where("id", Q.oneOf(cardIds)))
    .fetch();
}

// ═══════════════════════════════════════════════════════════════════════════
// Interaction Tracking
// ═══════════════════════════════════════════════════════════════════════════

/** Record a new card interaction */
export async function recordInteraction(
  cardId: string,
  type: InteractionType,
  durationMs: number,
  smData: {
    easeFactor: number;
    intervalDays: number;
    repetitions: number;
    nextReviewAt: number;
  }
) {
  await database.write(async () => {
    await database.get("card_interactions").create((record: any) => {
      record.cardId = cardId;
      record.interactionType = type;
      record.durationMs = durationMs;
      record.easeFactor = smData.easeFactor;
      record.intervalDays = smData.intervalDays;
      record.repetitions = smData.repetitions;
      record.nextReviewAt = smData.nextReviewAt;
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// Weakness Aggregation (for Boss Battle)
// ═══════════════════════════════════════════════════════════════════════════

/** 
 * Get the user's weakest subjects by aggregating missed interactions.
 * Returns subjects sorted by miss count (descending).
 */
export async function getWeakSubjects(): Promise<
  { subject: string; misses: number }[]
> {
  const misses = await database
    .get("card_interactions")
    .query(
      Q.where(
        "interaction_type",
        Q.oneOf(["skipped", "quizzed_wrong"])
      )
    )
    .fetch();

  // Get the card details to find categories
  const cardIds = [...new Set(misses.map((m: any) => m.cardId))];
  if (cardIds.length === 0) return [];

  const cards = await database
    .get("cards")
    .query(Q.where("id", Q.oneOf(cardIds)))
    .fetch();

  const cardTagMap = new Map<string, string>();
  cards.forEach((c: any) => cardTagMap.set(c.id, c.tag));

  // Aggregate misses by subject
  const subjectMisses = new Map<string, number>();
  misses.forEach((m: any) => {
    const subject = cardTagMap.get(m.cardId) || "Unknown";
    subjectMisses.set(subject, (subjectMisses.get(subject) || 0) + 1);
  });

  return Array.from(subjectMisses.entries())
    .map(([subject, count]) => ({ subject, misses: count }))
    .sort((a, b) => b.misses - a.misses);
}

// ═══════════════════════════════════════════════════════════════════════════
// Streak Management
// ═══════════════════════════════════════════════════════════════════════════

/** Get or create today's streak record */
export async function getTodayStreak() {
  const today = new Date().toISOString().split("T")[0];
  const existing = await database
    .get("daily_streaks")
    .query(Q.where("date", today))
    .fetch();

  if (existing.length > 0) return existing[0];

  // Create today's record
  let record: any = null;
  await database.write(async () => {
    record = await database.get("daily_streaks").create((r: any) => {
      r.date = today;
      r.cardsRead = 0;
      r.quizzesCompleted = 0;
      r.xpEarned = 0;
      r.streakCount = 0;
    });
  });
  return record;
}

/** Increment cards read for today */
export async function incrementCardsRead() {
  const streak = await getTodayStreak();
  if (!streak) return;

  await database.write(async () => {
    await (streak as any).update((r: any) => {
      r.cardsRead = (r.cardsRead || 0) + 1;
    });
  });
}
