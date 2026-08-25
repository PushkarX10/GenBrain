/**
 * GenBrain — Daily Quests Modal Component
 *
 * Displays daily active quests, progress tracking, and claiming buttons.
 * - Fluid Plus Jakarta Sans typography
 * - Color Hunt palette (#191825, #865DFF, #E384FF, #FFA3FD)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Colors } from "../../constants/colors";
import { useGameStore, calculateRank } from "../../store/useGameStore";

interface SystemModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SystemModal({ visible, onClose }: SystemModalProps) {
  const quests = useGameStore((s) => s.quests);
  const xp = useGameStore((s) => s.xp);
  const rank = calculateRank(xp);
  const claimQuest = useGameStore((s) => s.claimQuest);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Daily Quests</Text>
            <Text style={styles.resetLabel}>
              Resets at midnight · Rank {rank.tier}
            </Text>
          </View>

          {/* Quest Items List */}
          <ScrollView contentContainerStyle={styles.questList}>
            {quests.map((q) => {
              const complete = q.progress >= q.goal;
              return (
                <View key={q.id} style={styles.questCard}>
                  <View style={styles.questTitleRow}>
                    <Text style={styles.questText}>{q.text}</Text>
                    <Text style={styles.xpText}>+{q.xp} XP</Text>
                  </View>

                  {/* Progress bar */}
                  <View style={styles.progressRow}>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min(
                              100,
                              (q.progress / q.goal) * 100
                            )}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressRatio}>
                      {q.progress}/{q.goal}
                    </Text>
                  </View>

                  {/* Action / Status */}
                  <View style={styles.actionRow}>
                    {q.claimed ? (
                      <View style={styles.claimedBadge}>
                        <Text style={styles.claimedText}>✓ Claimed</Text>
                      </View>
                    ) : complete ? (
                      <TouchableOpacity
                        onPress={() => claimQuest(q.id)}
                        style={styles.claimButton}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.claimButtonText}>
                          Claim +{q.xp} XP
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.inProgressText}>
                        In Progress
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}

            <Text style={styles.warningText}>
              Incomplete quests will reset at midnight.
            </Text>
          </ScrollView>

          {/* Dismiss Button */}
          <TouchableOpacity
            onPress={onClose}
            style={styles.dismissButton}
            activeOpacity={0.8}
          >
            <Text style={styles.dismissText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(25, 24, 37, 0.82)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },
  modalCard: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: Colors.surface,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  header: {
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 20,
    color: Colors.inkBright,
  },
  resetLabel: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 12,
    color: Colors.inkDim,
    marginTop: 4,
  },
  questList: {
    padding: 16,
    gap: 12,
  },
  questCard: {
    backgroundColor: Colors.surface2,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  questTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 14,
    color: Colors.inkBright,
    flex: 1,
  },
  xpText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 13,
    color: Colors.accentHighlight,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.bg,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  progressRatio: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 11,
    color: Colors.inkDim,
  },
  actionRow: {
    marginTop: 10,
  },
  claimedBadge: {
    backgroundColor: Colors.accentSoft,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: "center",
  },
  claimedText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 12,
    color: Colors.accentSecondary,
  },
  claimButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
  },
  claimButtonText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 12,
    color: Colors.inkPure,
  },
  inProgressText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 11,
    color: Colors.inkDim,
    textAlign: "center",
    paddingVertical: 4,
  },
  warningText: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 11,
    color: Colors.inkDim,
    textAlign: "center",
    marginTop: 6,
  },
  dismissButton: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 14,
    alignItems: "center",
  },
  dismissText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 13,
    color: Colors.inkMuted,
  },
});
