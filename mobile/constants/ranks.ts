/**
 * GenBrain — Rank Tier Constants
 *
 * Exported separately from the store for use in components
 * that only need rank display data without full state management.
 */

export const RANKS = [
  { tier: "E", min: 0 },
  { tier: "D", min: 400 },
  { tier: "C", min: 1000 },
  { tier: "B", min: 2100 },
  { tier: "A", min: 3600 },
  { tier: "S", min: 5600 },
] as const;

export type RankTierKey = (typeof RANKS)[number]["tier"];
