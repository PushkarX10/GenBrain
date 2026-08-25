/**
 * GenBrain — Design Tokens (Dark Purple / Neon Orchid Mode)
 *
 * Color Hunt Palette:
 * - #191825 (Midnight Purple — Primary Background)
 * - #865DFF (Electric Purple — Primary Accent)
 * - #E384FF (Radiant Orchid — Secondary Accent)
 * - #FFA3FD (Neon Pastel Pink — Highlight Accent)
 */

export const Colors = {
  // ── Backgrounds ────────────────────────────────────────────────────
  bg: "#191825",                          // Palette #1: Deep midnight purple
  surface: "#232136",                     // Harmonious dark purple card surface
  surface2: "#2E2A47",                    // Elevated interactive surface
  surfaceGlass: "rgba(35, 33, 54, 0.88)", // Glassmorphism overlays

  // ── Palette Direct References ──────────────────────────────────────
  paletteDark: "#191825",
  palettePurple: "#865DFF",
  paletteOrchid: "#E384FF",
  palettePink: "#FFA3FD",

  // ── Interactive Accents ────────────────────────────────────────────
  accent: "#865DFF",                      // Palette #2: Primary vibrant interactive
  accentSecondary: "#E384FF",             // Palette #3: Secondary highlights / tags
  accentHighlight: "#FFA3FD",             // Palette #4: Glow & emphasis
  accentSoft: "rgba(134, 93, 255, 0.18)", // Subtle purple glow background
  accentMid: "rgba(134, 93, 255, 0.38)",  // Medium purple for borders

  orchidSoft: "rgba(227, 132, 255, 0.16)",
  orchidMid: "rgba(227, 132, 255, 0.38)",
  pinkSoft: "rgba(255, 163, 253, 0.16)",
  pinkMid: "rgba(255, 163, 253, 0.35)",

  // Legacy aliases to preserve backward compatibility
  sand: "#FFA3FD",
  sage: "#E384FF",

  // ── Text ───────────────────────────────────────────────────────────
  ink: "#F2EFFC",                         // Off-white with gentle lilac tint
  inkBright: "#FFFFFF",                   // Pure white for prominent headings
  inkMuted: "rgba(242, 239, 252, 0.65)",  // Secondary text
  inkDim: "rgba(242, 239, 252, 0.38)",    // Tertiary / placeholder
  inkPure: "#FFFFFF",                     // Interactive emphasis

  // ── Semantic ───────────────────────────────────────────────────────
  error: "#FF5C7A",                       // Neon crimson for errors/wrong
  errorSoft: "rgba(255, 92, 122, 0.16)",
  success: "#5CE6A6",                     // Mint green for success
  successSoft: "rgba(92, 230, 166, 0.16)",
  warning: "#FFA3FD",                     // Neon pink/amber for alerts

  // ── Rank Colors ────────────────────────────────────────────────────
  gold: "#FFD166",
  goldLight: "#FFE49E",
  goldDark: "#3D2E0B",
  goldSoft: "rgba(255, 209, 102, 0.2)",

  // ── Card Gradients ─────────────────────────────────────────────────
  cardGradientStart: "#27243E",
  cardGradientEnd: "#1D1B2D",

  // ── Borders ────────────────────────────────────────────────────────
  border: "rgba(227, 132, 255, 0.12)",    // Subtle orchid border
  borderAccent: "rgba(134, 93, 255, 0.45)", // Glowing electric purple border
} as const;

export type ColorKey = keyof typeof Colors;
