/**
 * GenBrain — Entry Point
 *
 * Redirects to onboarding (if first launch) or the main tab navigator.
 */

import { Redirect } from "expo-router";
import { useSettingsStore } from "../store/useSettingsStore";

export default function Index() {
  const isOnboarded = useSettingsStore((s) => s.isOnboarded);

  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
