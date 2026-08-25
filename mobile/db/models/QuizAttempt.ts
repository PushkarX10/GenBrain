/**
 * GenBrain — QuizAttempt WatermelonDB Model
 */

import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export default class QuizAttempt extends Model {
  static table = "quiz_attempts";

  @text("category_id") categoryId!: string | null;
  @field("score") score!: number;
  @field("total") total!: number;
  @field("is_boss_battle") isBossBattle!: boolean;
  @field("xp_earned") xpEarned!: number;
  @field("completed_at") completedAt!: number;
}
