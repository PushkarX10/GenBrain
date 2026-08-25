/**
 * GenBrain — DailyStreak WatermelonDB Model
 */

import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export default class DailyStreak extends Model {
  static table = "daily_streaks";

  @text("date") date!: string; // YYYY-MM-DD
  @field("cards_read") cardsRead!: number;
  @field("quizzes_completed") quizzesCompleted!: number;
  @field("xp_earned") xpEarned!: number;
  @field("streak_count") streakCount!: number;
}
