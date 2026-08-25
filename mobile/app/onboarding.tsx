/**
 * GenBrain — Onboarding Screen
 *
 * Niche selection flow — the user picks at least 3 knowledge categories.
 * - Fluid Plus Jakarta Sans typography
 * - Color Hunt palette (#191825, #865DFF, #E384FF, #FFA3FD)
 */

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

import { Colors } from "../constants/colors";
import { NICHES, MIN_NICHES } from "../constants/niches";
import { useSettingsStore } from "../store/useSettingsStore";

export default function OnboardingScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);

  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const enough = selected.length >= MIN_NICHES;

  const handleDone = () => {
    completeOnboarding(selected);
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <Text style={styles.step}>Step 1 of 2</Text>
        <Text style={styles.title}>
          What sparks{"\n"}your curiosity?
        </Text>
        <Text style={styles.subtitle}>
          Choose at least three topics to personalize your daily facts and quiz challenges.
        </Text>

        {/* Niche chips */}
        <View style={styles.chipGrid}>
          {NICHES.map((n) => {
            const on = selected.includes(n.key);
            return (
              <TouchableOpacity
                key={n.key}
                onPress={() => toggle(n.key)}
                style={[styles.chip, on && styles.chipActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipGlyph, on && styles.chipGlyphActive]}>
                  {n.glyph}
                </Text>
                <Text style={[styles.chipLabel, on && styles.chipLabelActive]}>
                  {n.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky bottom button */}
      <View style={styles.bottom}>
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {selected.length} of {MIN_NICHES} selected
          </Text>
          {enough && (
            <Text style={[styles.counterText, { color: Colors.success, fontFamily: "PlusJakartaSans_600SemiBold" }]}>
              ✓ Ready
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleDone}
          disabled={!enough}
          style={[styles.button, !enough && styles.buttonDisabled]}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.buttonText,
              !enough && styles.buttonTextDisabled,
            ]}
          >
            Continue →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  step: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 13,
    color: Colors.accentSecondary,
  },
  title: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 28,
    lineHeight: 34,
    color: Colors.inkBright,
    marginTop: 12,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: Colors.inkMuted,
    marginTop: 10,
    maxWidth: 290,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 28,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: {
    borderColor: "transparent",
    backgroundColor: Colors.accent,
  },
  chipGlyph: {
    fontSize: 14,
    color: Colors.accentSecondary,
  },
  chipGlyphActive: {
    color: Colors.inkPure,
  },
  chipLabel: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: Colors.inkMuted,
  },
  chipLabelActive: {
    color: Colors.inkPure,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  counter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  counterText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 12,
    color: Colors.inkDim,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: Colors.surface2,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 15,
    color: Colors.inkPure,
  },
  buttonTextDisabled: {
    color: Colors.inkDim,
  },
});
