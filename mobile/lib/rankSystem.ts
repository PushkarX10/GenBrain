/**
 * GenBrain — Rank System Utilities
 *
 * The progression system from E-Rank (entry) to S-Rank (apex).
 * Exported separately from the store for use in UI components
 * that don't need the full Zustand store.
 */

export interface RankTier {
  tier: string;
  min: number;
  label: string;
  description: string;
}

/** The complete rank ladder */
export const RANK_TIERS: RankTier[] = [
  { tier: "E", min: 0, label: "Novice", description: "Just awakened" },
  { tier: "D", min: 400, label: "Apprentice", description: "Learning the basics" },
  { tier: "C", min: 1000, label: "Scholar", description: "Glossy borders unlocked" },
  { tier: "B", min: 2100, label: "Expert", description: "Mastering the fundamentals" },
  { tier: "A", min: 3600, label: "Master", description: "Gold trim unlocked" },
  { tier: "S", min: 5600, label: "Sage", description: "Apex rank achieved" },
];

/**
 * Get the rank tier color scheme for UI rendering.
 */
export function getRankColors(tier: string): {
  bg: string;
  text: string;
  glow: string;
  gradient: [string, string];
} {
  switch (tier) {
    case "S":
    case "A":
      return {
        bg: "#C9A24B",
        text: "#3A2E12",
        glow: "rgba(201, 162, 75, 0.6)",
        gradient: ["#E4C877", "#C9A24B"],
      };
    case "C":
    case "B":
      return {
        bg: "#778873",
        text: "#FFFFFF",
        glow: "rgba(119, 136, 115, 0.5)",
        gradient: ["#A1BC98", "#778873"],
      };
    default: // E, D
      return {
        bg: "#1E1E1E",
        text: "#778873",
        glow: "rgba(119, 136, 115, 0.2)",
        gradient: ["#2A2A2A", "#1E1E1E"],
      };
  }
}

/**
 * Get a motivational message for the current rank.
 */
export function getRankMessage(tier: string, toNext: number): string {
  if (tier === "S") return "You've reached the apex. The System acknowledges you.";
  if (toNext <= 50) return `Almost there! Just ${toNext} XP to rank up!`;
  if (toNext <= 200) return `${toNext} XP until your next rank. Keep pushing.`;
  return `${toNext} XP to go. Every card counts.`;
}
