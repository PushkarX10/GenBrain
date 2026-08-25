/**
 * GenBrain — SM-2 Spaced Repetition Algorithm
 *
 * Implementation of the SuperMemo SM-2 algorithm, adapted for
 * GenBrain's flashcard interaction types.
 *
 * Quality mapping:
 *   0 = skipped (swiped away quickly, <1s)
 *   1 = viewed briefly (<3s)
 *   3 = viewed normally (>3s)
 *   4 = asked AI tutor about it
 *   5 = quizzed correctly
 *
 * The algorithm adjusts three values:
 *   - easeFactor: How "easy" this card is (min 1.3, default 2.5)
 *   - intervalDays: Days until the next scheduled review
 *   - repetitions: Count of consecutive successful recalls
 */

export interface SM2State {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: number; // timestamp (ms)
}

export type InteractionQuality = 0 | 1 | 2 | 3 | 4 | 5;

/** Default SM-2 state for a new card */
export const DEFAULT_SM2: SM2State = {
  easeFactor: 2.5,
  intervalDays: 0,
  repetitions: 0,
  nextReviewAt: 0,
};

/**
 * Map a GenBrain interaction type to an SM-2 quality score (0–5).
 */
export function interactionToQuality(
  type: string,
  durationMs: number
): InteractionQuality {
  switch (type) {
    case "skipped":
      return 0;
    case "viewed":
      return durationMs < 3000 ? 1 : 3;
    case "asked_ai":
      return 4;
    case "quizzed_correct":
      return 5;
    case "quizzed_wrong":
      return 1;
    default:
      return 3;
  }
}

/**
 * Calculate the next SM-2 state based on the current state and quality of recall.
 *
 * @param current - The current SM-2 state for this card.
 * @param quality - Quality of recall (0 = complete fail, 5 = perfect).
 * @returns The updated SM-2 state.
 */
export function calculateNextReview(
  current: SM2State,
  quality: InteractionQuality
): SM2State {
  let { easeFactor, intervalDays, repetitions } = current;

  if (quality >= 3) {
    // Successful recall — extend the interval
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions += 1;
  } else {
    // Failed recall — reset to beginning
    repetitions = 0;
    intervalDays = 1;
  }

  // Update ease factor (never below 1.3)
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Calculate the next review timestamp
  const nextReviewAt = Date.now() + intervalDays * 24 * 60 * 60 * 1000;

  return {
    easeFactor,
    intervalDays,
    repetitions,
    nextReviewAt,
  };
}

/**
 * Check if a card is due for review.
 */
export function isDueForReview(state: SM2State): boolean {
  return state.nextReviewAt <= Date.now();
}

/**
 * Get a human-readable description of when the next review is.
 */
export function getNextReviewLabel(state: SM2State): string {
  if (state.repetitions === 0) return "New";
  if (isDueForReview(state)) return "Due now";

  const days = state.intervalDays;
  if (days === 1) return "Tomorrow";
  if (days < 7) return `In ${days} days`;
  if (days < 30) return `In ${Math.round(days / 7)} weeks`;
  return `In ${Math.round(days / 30)} months`;
}
