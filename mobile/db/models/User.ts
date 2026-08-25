/**
 * GenBrain — User WatermelonDB Model
 */

import { Model } from "@nozbe/watermelondb";
import { field, text, json, date, readonly } from "@nozbe/watermelondb/decorators";

const sanitizeNiches = (raw: string | string[]): string[] => {
  if (Array.isArray(raw)) return raw;
  try {
    return JSON.parse(raw as string);
  } catch {
    return [];
  }
};

export default class User extends Model {
  static table = "users";

  @text("display_name") displayName!: string;
  @json("selected_niches", sanitizeNiches) selectedNiches!: string[];
  @field("total_xp") totalXp!: number;
  @field("current_streak") currentStreak!: number;
  @field("longest_streak") longestStreak!: number;
  @field("onboarded_at") onboardedAt!: number;
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
}
