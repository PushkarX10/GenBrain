/**
 * GenBrain — Font System Configuration
 *
 * "System HUD" Pairing — optimized for the gamification-heavy aesthetic:
 *
 *   DISPLAY (Rajdhani):
 *     Rank displays, quiz timers, daily quest titles, nav labels.
 *     Squared-off geometric forms that glow against dark backgrounds.
 *
 *   BODY (Inter):
 *     Flashcard facts, news summaries, AI chat bubbles.
 *     Gold standard for screen readability — zero eye strain.
 *
 *   MONO (Space Mono):
 *     XP counters, timestamps, progress labels, system messages.
 *     Terminal aesthetic that reinforces the "System" identity.
 */

export const Fonts = {
  /** Headers, rank displays, quiz timers, nav labels */
  display: {
    family: "Rajdhani",
    weights: {
      regular: "Rajdhani_400Regular",
      medium: "Rajdhani_500Medium",
      semibold: "Rajdhani_600SemiBold",
      bold: "Rajdhani_700Bold",
    },
  },

  /** Flashcard facts, news summaries, AI chat bubbles */
  body: {
    family: "Inter",
    weights: {
      regular: "Inter_400Regular",
      medium: "Inter_500Medium",
      semibold: "Inter_600SemiBold",
    },
  },

  /** XP counters, timestamps, progress labels */
  mono: {
    family: "SpaceMono",
    weights: {
      regular: "SpaceMono_400Regular",
      bold: "SpaceMono_700Bold",
    },
  },
} as const;

/**
 * Expo Google Fonts imports for _layout.tsx:
 *
 * import {
 *   Rajdhani_400Regular,
 *   Rajdhani_500Medium,
 *   Rajdhani_600SemiBold,
 *   Rajdhani_700Bold,
 * } from "@expo-google-fonts/rajdhani";
 *
 * import {
 *   Inter_400Regular,
 *   Inter_500Medium,
 *   Inter_600SemiBold,
 * } from "@expo-google-fonts/inter";
 *
 * import {
 *   SpaceMono_400Regular,
 *   SpaceMono_700Bold,
 * } from "@expo-google-fonts/space-mono";
 */

/** Font size scale */
export const FontSizes = {
  xs: 9,
  sm: 11,
  base: 14,
  md: 16,
  lg: 20,
  xl: 23,
  "2xl": 26,
  "3xl": 30,
  "4xl": 36,
} as const;

/** Line height multipliers */
export const LineHeights = {
  tight: 1.12,
  snug: 1.24,
  normal: 1.4,
  relaxed: 1.6,
} as const;

/** Letter spacing values */
export const LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1.0,
  widest: 2.0,
  mono: 3.0,  // For monospace system labels
} as const;
