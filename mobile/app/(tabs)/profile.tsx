/**
 * GenBrain — Profile Screen
 *
 * Clean user profile with editable fields:
 * - Fluid Plus Jakarta Sans typography
 * - Color Hunt palette (#191825, #865DFF, #E384FF, #FFA3FD)
 * - Tappable avatar (image picker)
 * - Editable display name
 * - Birthday picker + auto-calculated age
 * - Rank progression badge & tier preview
 * - Clean stats overview (Total XP, accuracy, streak)
 * - Tracked weak spots
 * - Privacy settings (on-device AI, local storage toggles)
 */

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import { Colors } from "../../constants/colors";
import { RANKS } from "../../constants/ranks";
import { useGameStore, calculateRank } from "../../store/useGameStore";
import { useSettingsStore } from "../../store/useSettingsStore";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const xp = useGameStore((s) => s.xp);
  const rank = calculateRank(xp);
  const streak = useGameStore((s) => s.currentStreak);
  const weaknesses = useGameStore((s) => s.weaknesses);

  const displayName = useSettingsStore((s) => s.displayName);
  const birthday = useSettingsStore((s) => s.birthday);
  const profileImageUri = useSettingsStore((s) => s.profileImageUri);
  const getAge = useSettingsStore((s) => s.getAge);
  const setDisplayName = useSettingsStore((s) => s.setDisplayName);
  const setBirthday = useSettingsStore((s) => s.setBirthday);
  const setProfileImage = useSettingsStore((s) => s.setProfileImage);
  const localAi = useSettingsStore((s) => s.localAiEnabled);
  const localStore = useSettingsStore((s) => s.localStorageOnly);
  const setLocalAi = useSettingsStore((s) => s.setLocalAi);
  const setLocalStorage = useSettingsStore((s) => s.setLocalStorageOnly);

  const [editingName, setEditingName] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState(false);
  const [nameInput, setNameInput] = useState(displayName || "");
  const [birthdayInput, setBirthdayInput] = useState(birthday || "");

  const age = getAge();

  const stats = [
    { label: "Total XP", value: xp.toLocaleString() },
    { label: "Quiz Accuracy", value: "86%" },
    { label: "Day Streak", value: String(streak || 1) },
  ];

  // ── Image Picker ─────────────────────────────────────────────────────
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please allow access to your photo library to set a profile picture.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (e: any) {
      console.warn("Image picker error:", e);
    }
  };

  // ── Save Handlers ────────────────────────────────────────────────────
  const saveName = () => {
    setDisplayName(nameInput.trim());
    setEditingName(false);
  };

  const saveBirthday = () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (birthdayInput && !dateRegex.test(birthdayInput)) {
      Alert.alert("Invalid date", "Please enter your birthday as YYYY-MM-DD.");
      return;
    }
    setBirthday(birthdayInput.trim());
    setEditingBirthday(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top + 8, 20) },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header — Avatar + Name */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
          {profileImageUri ? (
            <Image source={{ uri: profileImageUri }} style={styles.avatar} />
          ) : (
            <View style={[
              styles.avatarPlaceholder,
              rank.gold && styles.avatarGold,
            ]}>
              <Text style={[
                styles.avatarInitial,
                rank.gold && styles.avatarInitialGold,
              ]}>
                {displayName ? displayName.charAt(0).toUpperCase() : rank.tier}
              </Text>
            </View>
          )}
          <View style={styles.editAvatarBadge}>
            <Text style={styles.editAvatarIcon}>📷</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.nameArea}>
          {editingName ? (
            <View style={styles.inlineEdit}>
              <TextInput
                value={nameInput}
                onChangeText={setNameInput}
                style={styles.nameInput}
                placeholder="Your name"
                placeholderTextColor={Colors.inkDim}
                autoFocus
                onSubmitEditing={saveName}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={saveName} style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => { setNameInput(displayName); setEditingName(true); }}>
              <Text style={styles.name}>
                {displayName || "Tap to set name"}
              </Text>
              <Text style={styles.editHint}>Tap to edit</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.rankLabel}>
            Rank {rank.tier} · Scholar
          </Text>
        </View>
      </View>

      {/* Birthday & Age */}
      <View style={styles.profileInfoCard}>
        <View style={styles.profileInfoRow}>
          <Text style={styles.profileInfoLabel}>Birthday</Text>
          {editingBirthday ? (
            <View style={styles.inlineEditRow}>
              <TextInput
                value={birthdayInput}
                onChangeText={setBirthdayInput}
                style={styles.birthdayInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.inkDim}
                autoFocus
                keyboardType="numbers-and-punctuation"
                onSubmitEditing={saveBirthday}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={saveBirthday} style={styles.saveBadgeSmall}>
                <Text style={styles.saveBadgeText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => { setBirthdayInput(birthday); setEditingBirthday(true); }}>
              <Text style={styles.profileInfoValue}>
                {birthday || "Tap to set"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.profileInfoDivider} />
        <View style={styles.profileInfoRow}>
          <Text style={styles.profileInfoLabel}>Age</Text>
          <Text style={styles.profileInfoValue}>
            {age !== null ? `${age} years` : "—"}
          </Text>
        </View>
      </View>

      {/* Rank Ladder */}
      <View style={styles.ladderCard}>
        <View style={styles.ladderRow}>
          {RANKS.map((r, i) => {
            const reached = i <= rank.idx;
            const isGold = r.tier === "A" || r.tier === "S";
            return (
              <View key={r.tier} style={styles.ladderItem}>
                <View style={[
                  styles.ladderBadge,
                  reached && styles.ladderBadgeReached,
                  reached && isGold && rank.gold && styles.ladderBadgeGold,
                ]}>
                  <Text style={[
                    styles.ladderBadgeText,
                    reached && styles.ladderBadgeTextReached,
                    reached && isGold && rank.gold && styles.ladderBadgeTextGold,
                  ]}>
                    {reached ? r.tier : "—"}
                  </Text>
                </View>
                <Text style={[
                  styles.ladderTierLabel,
                  reached && styles.ladderTierLabelReached,
                ]}>
                  {r.tier}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.ladderProgress}>
          <View style={[styles.ladderFill, { width: `${rank.pct}%` }]} />
        </View>
        <Text style={styles.ladderHint}>
          {rank.toNext} XP to next tier
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Weak Spots */}
      <Text style={styles.sectionTitle}>Review Topics</Text>
      <View style={styles.weakRow}>
        {weaknesses.length > 0 ? (
          weaknesses.map((w) => (
            <View key={w.subject} style={styles.weakChip}>
              <Text style={styles.weakChipText}>{w.subject}</Text>
              <Text style={styles.weakChipCount}>×{w.misses}</Text>
            </View>
          ))
        ) : (
          <View style={styles.noWeakChip}>
            <Text style={styles.noWeakText}>No weak spots identified</Text>
          </View>
        )}
      </View>

      {/* Privacy */}
      <View style={styles.privacyHeader}>
        <Text style={styles.sectionTitle}>Privacy & Storage</Text>
        <View style={styles.offlineBadge}>
          <Text style={styles.offlineBadgeText}>On-Device</Text>
        </View>
      </View>

      {/* On-device AI toggle */}
      <View style={styles.settingRow}>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>On-Device AI</Text>
          <Text style={styles.settingSub}>
            Quizzes & explanations run locally on your device.
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setLocalAi(!localAi)}
          style={[styles.toggle, localAi && styles.toggleOn]}
        >
          <View style={[styles.toggleDot, localAi && styles.toggleDotOn]} />
        </TouchableOpacity>
      </View>

      {/* Local storage toggle */}
      <View style={styles.settingRow}>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>Local Storage Only</Text>
          <Text style={styles.settingSub}>
            Progress is kept securely on-device with zero tracking.
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setLocalStorage(!localStore)}
          style={[styles.toggle, localStore && styles.toggleOn]}
        >
          <View style={[styles.toggleDot, localStore && styles.toggleDotOn]} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    paddingHorizontal: 22,
    paddingBottom: 110,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 16,
  },

  // ── Avatar ────────────────────────────────────────────────────────
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.accentSecondary,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  avatarGold: {
    borderColor: Colors.gold,
  },
  avatarInitial: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 24,
    color: Colors.accentSecondary,
  },
  avatarInitialGold: {
    color: Colors.gold,
  },
  editAvatarBadge: {
    position: "absolute",
    bottom: -2,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.accentSecondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.bg,
  },
  editAvatarIcon: {
    fontSize: 10,
  },

  // ── Name Area ─────────────────────────────────────────────────────
  nameArea: {
    flex: 1,
  },
  name: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 20,
    color: Colors.inkBright,
    letterSpacing: -0.3,
  },
  editHint: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 11,
    color: Colors.inkDim,
    marginTop: 2,
  },
  inlineEdit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nameInput: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 18,
    color: Colors.inkBright,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.accentSecondary,
    flex: 1,
    paddingVertical: 4,
  },
  saveBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  saveBadgeSmall: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  saveBadgeText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 11,
    color: Colors.inkPure,
  },
  rankLabel: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 12,
    color: Colors.accentSecondary,
    marginTop: 4,
  },

  // ── Profile Info Card (Birthday/Age) ──────────────────────────────
  profileInfoCard: {
    marginTop: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: 16,
  },
  profileInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  profileInfoDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  profileInfoLabel: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 13,
    color: Colors.inkDim,
  },
  profileInfoValue: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 14,
    color: Colors.ink,
  },
  inlineEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  birthdayInput: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: Colors.inkBright,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.accentSecondary,
    paddingVertical: 2,
    minWidth: 110,
    textAlign: "right",
  },

  // ── Rank Ladder ───────────────────────────────────────────────────
  ladderCard: {
    marginTop: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: 16,
  },
  ladderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ladderItem: {
    alignItems: "center",
    gap: 6,
  },
  ladderBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface2,
  },
  ladderBadgeReached: {
    backgroundColor: Colors.accent,
    borderColor: "transparent",
  },
  ladderBadgeGold: {
    backgroundColor: Colors.gold,
    borderColor: "transparent",
  },
  ladderBadgeText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 12,
    color: Colors.inkDim,
  },
  ladderBadgeTextReached: { color: Colors.inkPure },
  ladderBadgeTextGold: { color: Colors.goldDark },
  ladderTierLabel: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 11,
    color: Colors.inkDim,
  },
  ladderTierLabelReached: { color: Colors.accentSecondary },
  ladderProgress: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surface2,
    overflow: "hidden",
    marginTop: 14,
  },
  ladderFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  ladderHint: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 11,
    color: Colors.inkDim,
    textAlign: "center",
    marginTop: 10,
  },

  // ── Stats ─────────────────────────────────────────────────────────
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 18,
    color: Colors.inkBright,
  },
  statLabel: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 11,
    color: Colors.inkDim,
    marginTop: 4,
    textAlign: "center",
  },

  // ── Weak Spots ────────────────────────────────────────────────────
  sectionTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 15,
    color: Colors.inkBright,
    marginTop: 26,
  },
  weakRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  weakChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,92,122,0.35)",
    backgroundColor: Colors.errorSoft,
  },
  weakChipText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 13,
    color: Colors.error,
  },
  weakChipCount: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 11,
    color: Colors.error,
    opacity: 0.8,
  },
  noWeakChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.orchidMid,
    backgroundColor: Colors.orchidSoft,
  },
  noWeakText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 13,
    color: Colors.accentSecondary,
  },

  // ── Privacy ───────────────────────────────────────────────────────
  privacyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 26,
  },
  offlineBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.orchidSoft,
    borderWidth: 1,
    borderColor: Colors.orchidMid,
  },
  offlineBadgeText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 10,
    color: Colors.accentSecondary,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: 16,
  },
  settingContent: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 14,
    color: Colors.ink,
  },
  settingSub: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: Colors.inkMuted,
    marginTop: 2,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surface2,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleOn: {
    backgroundColor: Colors.accent,
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.inkPure,
  },
  toggleDotOn: {
    alignSelf: "flex-end",
  },
});
