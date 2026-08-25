/**
 * GenBrain — Card (Flashcard) WatermelonDB Model
 */

import { Model } from "@nozbe/watermelondb";
import { field, text, readonly, date } from "@nozbe/watermelondb/decorators";

export default class Card extends Model {
  static table = "cards";

  @text("category_id") categoryId!: string;
  @text("front") front!: string;
  @text("back") back!: string;
  @text("deep_dive") deepDive!: string;
  @text("tag") tag!: string;
  @text("source_url") sourceUrl!: string | null;
  @text("source_name") sourceName!: string | null;
  @text("published_date") publishedDate!: string;
  @readonly @date("created_at") createdAt!: Date;
}
