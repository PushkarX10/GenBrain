/**
 * GenBrain — CardInteraction WatermelonDB Model
 *
 * Tracks every user interaction with a flashcard for the
 * SM-2 spaced repetition algorithm.
 */

import { Model } from "@nozbe/watermelondb";
import { field, text, readonly, date } from "@nozbe/watermelondb/decorators";

export type InteractionType =
  | "viewed"
  | "skipped"
  | "asked_ai"
  | "quizzed_correct"
  | "quizzed_wrong";

export default class CardInteraction extends Model {
  static table = "card_interactions";

  @text("card_id") cardId!: string;
  @text("interaction_type") interactionType!: InteractionType;
  @field("duration_ms") durationMs!: number;

  // SM-2 fields
  @field("ease_factor") easeFactor!: number;       // default 2.5
  @field("interval_days") intervalDays!: number;   // days until next review
  @field("repetitions") repetitions!: number;       // successful review count
  @field("next_review_at") nextReviewAt!: number;   // timestamp

  @readonly @date("created_at") createdAt!: Date;
}
