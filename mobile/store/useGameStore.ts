/**
 * GenBrain — Gamification State Store (Zustand)
 *
 * Manages the entire "System" gamification layer:
 * - XP tracking and rank progression (E → S)
 * - Daily streaks
 * - Daily quests with claim/progress
 * - Weakness tracking for Boss Battles
 *
 * Persisted to AsyncStorage so progress survives app restarts.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export interface RankInfo {
  tier: string;
  idx: number;
  floor: number;
  ceil: number;
  pct: number;
  toNext: number;
  glossy: boolean; // C+ unlocks glossy card borders
  gold: boolean;   // A+ unlocks gold trim
}

export interface Quest {
  id: string;
  text: string;
  goal: number;
  progress: number;
  xp: number;
  claimed: boolean;
}

export interface Weakness {
  subject: string;
  misses: number;
}

export type XpSource =
  | "card_read"
  | "card_deep_dive"
  | "quiz_pass"
  | "quiz_perfect"
  | "boss_clear"
  | "streak_maintain"
  | "quest_claim";

// ═══════════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════════

/** XP award table — how much XP each action grants */
export const XP_AWARDS: Record<XpSource, number> = {
  card_read: 4,
  card_deep_dive: 8,
  quiz_pass: 45,
  quiz_perfect: 90,
  boss_clear: 240,
  streak_maintain: 40,
  quest_claim: 0, // Quest XP is defined per-quest
};

/** Rank thresholds — E is entry tier, S is apex */
const RANKS = [
  { tier: "E", min: 0 },
  { tier: "D", min: 400 },
  { tier: "C", min: 1000 },
  { tier: "B", min: 2100 },
  { tier: "A", min: 3600 },
  { tier: "S", min: 5600 },
] as const;

/** Default daily quests */
const DEFAULT_QUESTS: Quest[] = [
  { id: "read", text: "Read 10 cards", goal: 10, progress: 0, xp: 60, claimed: false },
  { id: "perfect", text: "Score 100% on a quiz", goal: 1, progress: 0, xp: 120, claimed: false },
  { id: "streak", text: "Maintain your daily streak", goal: 1, progress: 1, xp: 40, claimed: false },
];

// ═══════════════════════════════════════════════════════════════════════════
// Rank Calculation
// ═══════════════════════════════════════════════════════════════════════════

export function calculateRank(xp: number): RankInfo {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].min) idx = i;
  }
  const floor = RANKS[idx].min;
  const ceil = idx < RANKS.length - 1 ? RANKS[idx + 1].min : floor;
  const pct = ceil > floor ? Math.min(100, ((xp - floor) / (ceil - floor)) * 100) : 100;

  return {
    tier: RANKS[idx].tier,
    idx,
    floor,
    ceil,
    pct,
    toNext: Math.max(0, ceil - xp),
    glossy: idx >= 2, // C-rank and above
    gold: idx >= 4,   // A-rank and above
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Store Interface
// ═══════════════════════════════════════════════════════════════════════════

interface GameState {
  // Core state
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  quests: Quest[];
  weaknesses: Weakness[];

  // Actions
  addXp: (amount: number, source: XpSource) => void;
  bumpQuest: (questId: string, by?: number) => void;
  claimQuest: (questId: string) => void;
  recordMiss: (subject: string) => void;
  clearWeaknesses: () => void;
  checkAndUpdateStreak: () => void;
  resetDailyQuests: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// Store Implementation
// ═══════════════════════════════════════════════════════════════════════════

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // ── Initial State ────────────────────────────────────────────────
      xp: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: "",
      quests: [...DEFAULT_QUESTS],
      weaknesses: [],

      // ── Actions ──────────────────────────────────────────────────────

      /** Award XP from a specific source action */
      addXp: (amount: number, _source: XpSource) => {
        set((state) => ({
          xp: state.xp + amount,
        }));
      },

      /** Increment progress on a daily quest */
      bumpQuest: (questId: string, by = 1) => {
        set((state) => ({
          quests: state.quests.map((q) =>
            q.id === questId
              ? { ...q, progress: Math.min(q.goal, q.progress + by) }
              : q
          ),
        }));
      },

      /** Claim a completed quest's XP reward */
      claimQuest: (questId: string) => {
        const state = get();
        const quest = state.quests.find((q) => q.id === questId);
        if (!quest || quest.claimed || quest.progress < quest.goal) return;

        set({
          xp: state.xp + quest.xp,
          quests: state.quests.map((q) =>
            q.id === questId ? { ...q, claimed: true } : q
          ),
        });
      },

      /** Record a quiz miss for Boss Battle weakness tracking */
      recordMiss: (subject: string) => {
        set((state) => {
          const existing = state.weaknesses.find((w) => w.subject === subject);
          if (existing) {
            return {
              weaknesses: state.weaknesses.map((w) =>
                w.subject === subject ? { ...w, misses: w.misses + 1 } : w
              ),
            };
          }
          return {
            weaknesses: [...state.weaknesses, { subject, misses: 1 }],
          };
        });
      },

      /** Clear all weaknesses (called after Boss Battle victory) */
      clearWeaknesses: () => set({ weaknesses: [] }),

      /** Check if the streak should be maintained or broken */
      checkAndUpdateStreak: () => {
        const today = new Date().toISOString().split("T")[0];
        const state = get();

        if (state.lastActiveDate === today) return; // Already checked today

        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .split("T")[0];

        if (state.lastActiveDate === yesterday) {
          // Streak continues
          const newStreak = state.currentStreak + 1;
          set({
            currentStreak: newStreak,
            longestStreak: Math.max(state.longestStreak, newStreak),
            lastActiveDate: today,
          });
        } else if (state.lastActiveDate !== today) {
          // Streak broken (or first day)
          set({
            currentStreak: 1,
            lastActiveDate: today,
          });
        }
      },

      /** Reset daily quests (called at midnight or on new day) */
      resetDailyQuests: () => {
        set({ quests: [...DEFAULT_QUESTS] });
      },
    }),
    {
      name: "genbrain-game-state",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these fields (exclude computed functions)
      partialize: (state) => ({
        xp: state.xp,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastActiveDate: state.lastActiveDate,
        quests: state.quests,
        weaknesses: state.weaknesses,
      }),
    }
  )
);
