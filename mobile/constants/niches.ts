/**
 * GenBrain — Knowledge Niche Definitions
 *
 * The 8 knowledge categories available in the app.
 * Glyphs are Unicode symbols used in the onboarding chips.
 */

export interface Niche {
  key: string;
  label: string;
  glyph: string;
}

export const NICHES: Niche[] = [
  { key: "science", label: "Science", glyph: "⌬" },
  { key: "tech", label: "Tech", glyph: "⌘" },
  { key: "history", label: "History", glyph: "⌛" },
  { key: "geography", label: "Geography", glyph: "◈" },
  { key: "space", label: "Space", glyph: "✷" },
  { key: "economy", label: "Economy", glyph: "⌗" },
  { key: "culture", label: "Culture", glyph: "❖" },
  { key: "health", label: "Health", glyph: "✚" },
];

/** Minimum niches required during onboarding */
export const MIN_NICHES = 3;
