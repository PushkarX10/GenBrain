/**
 * GenBrain — Category WatermelonDB Model
 */

import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export default class Category extends Model {
  static table = "categories";

  @text("key") key!: string;
  @text("label") label!: string;
  @text("glyph") glyph!: string;
  @field("is_selected") isSelected!: boolean;
  @field("sort_order") sortOrder!: number;
}
