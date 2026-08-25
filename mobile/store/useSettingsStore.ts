/**
 * GenBrain — Settings State Store (Zustand)
 *
 * Manages user preferences, profile, and privacy toggles:
 * - User profile (name, birthday, avatar)
 * - Selected knowledge niches
 * - Onboarding state
 * - Privacy settings (on-device AI, local storage)
 * - Backend URL configuration
 *
 * Persisted to AsyncStorage.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingsState {
  // User Profile
  displayName: string;
  birthday: string; // ISO date string YYYY-MM-DD
  profileImageUri: string | null;

  // Onboarding
  isOnboarded: boolean;
  selectedNiches: string[];

  // Privacy toggles
  localAiEnabled: boolean;
  localStorageOnly: boolean;

  // Backend
  backendUrl: string;
  ollamaUrl: string;

  // Computed
  getAge: () => number | null;

  // Actions
  setDisplayName: (name: string) => void;
  setBirthday: (date: string) => void;
  setProfileImage: (uri: string | null) => void;
  completeOnboarding: (niches: string[]) => void;
  toggleNiche: (niche: string) => void;
  setLocalAi: (enabled: boolean) => void;
  setLocalStorageOnly: (enabled: boolean) => void;
  setBackendUrl: (url: string) => void;
  setOllamaUrl: (url: string) => void;
}

function calculateAge(birthday: string): number | null {
  if (!birthday) return null;
  const birth = new Date(birthday);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      displayName: "",
      birthday: "",
      profileImageUri: null,

      isOnboarded: false,
      selectedNiches: [],
      localAiEnabled: true,
      localStorageOnly: true,
      backendUrl: "http://localhost:8000",
      ollamaUrl: "http://localhost:11434",

      getAge: () => calculateAge(get().birthday),

      setDisplayName: (name) => set({ displayName: name }),
      setBirthday: (date) => set({ birthday: date }),
      setProfileImage: (uri) => set({ profileImageUri: uri }),

      completeOnboarding: (niches) =>
        set({
          isOnboarded: true,
          selectedNiches: niches,
        }),

      toggleNiche: (niche) =>
        set((state) => ({
          selectedNiches: state.selectedNiches.includes(niche)
            ? state.selectedNiches.filter((n) => n !== niche)
            : [...state.selectedNiches, niche],
        })),

      setLocalAi: (enabled) => set({ localAiEnabled: enabled }),
      setLocalStorageOnly: (enabled) => set({ localStorageOnly: enabled }),
      setBackendUrl: (url) => set({ backendUrl: url }),
      setOllamaUrl: (url) => set({ ollamaUrl: url }),
    }),
    {
      name: "genbrain-settings",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        displayName: state.displayName,
        birthday: state.birthday,
        profileImageUri: state.profileImageUri,
        isOnboarded: state.isOnboarded,
        selectedNiches: state.selectedNiches,
        localAiEnabled: state.localAiEnabled,
        localStorageOnly: state.localStorageOnly,
        backendUrl: state.backendUrl,
        ollamaUrl: state.ollamaUrl,
      }),
    }
  )
);
