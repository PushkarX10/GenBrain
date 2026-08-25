/**
 * GenBrain — Home Screen (Cards)
 *
 * Features:
 * - Smart Search Bar with topic suggestions (Uiverse vinodjangid07 style without plus icon)
 * - KeyboardAvoiding layout preventing overlapping when clicking search bar
 * - Stacked physical flashcard deck (Uiverse janisar-hyder style)
 * - Capsule gradient navigation buttons (Uiverse xueyuantan style)
 * - Fluid Plus Jakarta Sans typography
 * - Color Hunt palette (#191825, #865DFF, #E384FF, #FFA3FD)
 * - Immersive card stack with tap-to-flip and "Ask Kihoro" tutor button
 */

import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop, Rect } from "react-native-svg";

import { Colors } from "../../constants/colors";
import { useGameStore } from "../../store/useGameStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useFlashcards, GK_CARDS } from "../../hooks/useFlashcards";
import { useCardStore } from "../../store/useCardStore";
import { useAITutor } from "../../hooks/useAITutor";
import ChatModal from "../../components/chat/ChatModal";
import SystemModal from "../../components/system/SystemModal";

// ── Search Topic Suggestions ─────────────────────────────────────────────

const TOPIC_SUGGESTIONS = [
  "Space",
  "Science",
  "History",
  "Nature",
  "Technology",
  "Geography",
  "Language",
  "Venus",
  "Bananas",
  "Octopus",
  "Flamingos",
  "Cleopatra",
];

// ── Clean SVG Icons ──────────────────────────────────────────────────────

function FlameIcon({ size = 16, color = Colors.accentHighlight }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.5 7.5 13 10 11 14C9.5 11 8.5 9 6 12C4 14.5 4 18 7.5 20.5C11 23 17 22.5 19 18C21 13.5 18 10 16 8C15 10 14 11 13 11C13 8 13.5 4.5 12 2Z"
        fill={color}
      />
    </Svg>
  );
}

function BellIcon({ size = 18, color = Colors.inkMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SparkleIcon({ size = 13, color = Colors.inkPure }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
        fill={color}
      />
    </Svg>
  );
}

function SendArrowIcon({ size = 20, color = Colors.inkDim }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const streak = useGameStore((s) => s.currentStreak);
  const quests = useGameStore((s) => s.quests);
  const claimable = quests.filter((q) => q.progress >= q.goal && !q.claimed).length;
  const displayName = useSettingsStore((s) => s.displayName);

  const { loadCards, onSwipe, onAskAI, currentCard } = useFlashcards();
  const setCards = useCardStore((s) => s.setCards);
  const cards = useCardStore((s) => s.cards);
  const isFlipped = useCardStore((s) => s.isFlipped);
  const flip = useCardStore((s) => s.flip);
  const { openChat } = useAITutor();

  const [systemOpen, setSystemOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const card = currentCard;

  // ── Search & Filter Logic ────────────────────────────────────────────
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const query = text.trim().toLowerCase();

    if (!query) {
      setCards(GK_CARDS);
      return;
    }

    const filtered = GK_CARDS.filter((c) => {
      return (
        c.tag.toLowerCase().includes(query) ||
        c.front.toLowerCase().includes(query) ||
        c.back.toLowerCase().includes(query) ||
        c.deepDive.toLowerCase().includes(query)
      );
    });

    setCards(filtered);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCards(GK_CARDS);
    Keyboard.dismiss();
  };

  const handleAskKihoro = (e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (card) {
      onAskAI(card);
      openChat(card);
    }
  };

  const isFiltered = searchQuery.trim().length > 0;

  // Filter suggestion list dynamically
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return TOPIC_SUGGESTIONS;
    return TOPIC_SUGGESTIONS.filter((s) =>
      s.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [searchQuery]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.root}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { paddingTop: Math.max(insets.top + 8, 20) }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                Welcome, {displayName || "Scholar"}
              </Text>
            </View>

            <View style={styles.headerRight}>
              <View style={styles.streakPill}>
                <FlameIcon size={15} color={Colors.accentHighlight} />
                <Text style={styles.streakNumber}>{streak || 1}</Text>
              </View>

              <TouchableOpacity
                onPress={() => setSystemOpen(true)}
                style={styles.iconButton}
                activeOpacity={0.75}
              >
                <BellIcon size={18} color={Colors.ink} />
                {claimable > 0 && (
                  <View style={styles.notificationDot} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Clean Search Bar (Plus icon removed) */}
          <View style={[styles.messageBox, isFocused && styles.messageBoxFocused]}>
            <TextInput
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search topics (e.g. Space, History)..."
              placeholderTextColor={Colors.inkDim}
              style={styles.messageInput}
              returnKeyType="search"
              onSubmitEditing={() => handleSearch(searchQuery)}
            />

            {searchQuery.trim().length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearIconBtn}>
                <Text style={styles.clearIconText}>✕</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                handleSearch(searchQuery);
                Keyboard.dismiss();
              }}
              style={styles.sendButton}
              activeOpacity={0.8}
            >
              <SendArrowIcon
                size={18}
                color={searchQuery.trim() ? Colors.accentHighlight : Colors.inkDim}
              />
            </TouchableOpacity>
          </View>

          {/* Related Suggestions */}
          {(isFocused || isFiltered) && filteredSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.suggestionsRow}
              >
                {filteredSuggestions.map((item) => {
                  const active = searchQuery.toLowerCase() === item.toLowerCase();
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        handleSearch(item);
                        Keyboard.dismiss();
                      }}
                      style={[styles.suggestionChip, active && styles.suggestionChipActive]}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.suggestionText, active && styles.suggestionTextActive]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Filter Status Badge */}
          {isFiltered && (
            <View style={styles.filterStatusRow}>
              <Text style={styles.filterStatusText}>
                Showing {cards.length} {cards.length === 1 ? "card" : "cards"} for "{searchQuery.trim()}"
              </Text>
              <TouchableOpacity onPress={clearSearch} style={styles.clearFilterChip}>
                <Text style={styles.clearFilterText}>✕ Clear</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Stacked Flashcard Deck (Uiverse janisar-hyder style) */}
          <View style={styles.cardArea}>
            {card ? (
              <View style={styles.stackWrapper}>
                {/* Background Underlay Card 1 (Rotated Left) */}
                <View style={styles.cardUnderlayLeft} />

                {/* Background Underlay Card 2 (Rotated Right) */}
                <View style={styles.cardUnderlayRight} />

                {/* Main Interactive Top Card */}
                <TouchableOpacity
                  onPress={flip}
                  activeOpacity={0.96}
                  style={styles.flashcard}
                >
                  {!isFlipped ? (
                    <View style={styles.cardInner}>
                      <View style={styles.tagBadge}>
                        <Text style={styles.tagText}>{card.tag}</Text>
                      </View>

                      <Text style={styles.cardQuestion}>{card.front}</Text>

                      <View style={styles.flipPrompt}>
                        <Text style={styles.flipPromptText}>Tap to reveal explanation</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.cardInner}>
                      <View style={styles.backTopRow}>
                        <View style={styles.tagBadge}>
                          <Text style={styles.tagText}>{card.tag}</Text>
                        </View>

                        <TouchableOpacity
                          onPress={handleAskKihoro}
                          style={styles.askButton}
                          activeOpacity={0.8}
                        >
                          <SparkleIcon size={12} color={Colors.inkPure} />
                          <Text style={styles.askButtonText}>Ask Kihoro</Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.cardAnswer}>{card.back}</Text>

                      <View style={styles.flipPrompt}>
                        <Text style={styles.flipPromptText}>Swipe or tap next →</Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No matching knowledge cards</Text>
                <Text style={styles.emptyText}>
                  We couldn't find cards matching "{searchQuery}".
                </Text>
                <TouchableOpacity onPress={clearSearch} style={styles.resetSearchBtn}>
                  <Text style={styles.resetSearchText}>View All Cards</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Capsule Navigation Buttons (Uiverse xueyuantan style) */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              onPress={() => onSwipe(-1)}
              disabled={cards.length <= 1}
              style={[styles.navButtonSecondary, cards.length <= 1 && styles.buttonDisabled]}
              activeOpacity={0.8}
            >
              <Text style={styles.navButtonTextSecondary}>← Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onSwipe(1)}
              disabled={cards.length <= 1}
              style={[styles.navButtonPrimary, cards.length <= 1 && styles.buttonDisabled]}
              activeOpacity={0.85}
            >
              <View style={StyleSheet.absoluteFillObject}>
                <Svg width="100%" height="100%" preserveAspectRatio="none">
                  <Defs>
                    <SvgGradient id="btnGrad" x1="0" y1="0" x2="1" y2="0">
                      <Stop offset="0" stopColor="#865DFF" />
                      <Stop offset="100%" stopColor="#E384FF" />
                    </SvgGradient>
                  </Defs>
                  <Rect width="100%" height="100%" rx={25} fill="url(#btnGrad)" />
                </Svg>
              </View>
              <Text style={styles.navButtonTextPrimary}>Next Card →</Text>
            </TouchableOpacity>
          </View>

          {/* Modals */}
          <ChatModal />
          <SystemModal visible={systemOpen} onClose={() => setSystemOpen(false)} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
  },

  // ── Header ──────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 2,
  },
  greeting: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 23,
    color: Colors.inkBright,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 13,
    color: Colors.inkMuted,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakNumber: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 13,
    color: Colors.accentHighlight,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentSecondary,
  },

  // ── Clean Search Bar (Without plus icon) ────────────────────────────
  messageBox: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(227, 132, 255, 0.18)",
    marginTop: 22,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  messageBoxFocused: {
    borderColor: Colors.accentSecondary,
    shadowOpacity: 0.3,
  },
  messageInput: {
    flex: 1,
    height: "100%",
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: Colors.inkBright,
    paddingVertical: 0,
  },
  clearIconBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  clearIconText: {
    color: Colors.inkDim,
    fontSize: 13,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  sendButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 8,
  },

  // ── Related Suggestions ─────────────────────────────────────────────
  suggestionsContainer: {
    marginTop: 8,
    height: 36,
  },
  suggestionsRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingRight: 16,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionChipActive: {
    backgroundColor: Colors.accent,
    borderColor: "transparent",
  },
  suggestionText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 12,
    color: Colors.inkMuted,
  },
  suggestionTextActive: {
    color: Colors.inkPure,
    fontFamily: "PlusJakartaSans_700Bold",
  },

  // ── Filter Status ───────────────────────────────────────────────────
  filterStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  filterStatusText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 12,
    color: Colors.accentSecondary,
  },
  clearFilterChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clearFilterText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 11,
    color: Colors.inkMuted,
  },

  // ── Stacked Flashcard Deck (Uiverse janisar-hyder style) ─────────────
  cardArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  stackWrapper: {
    width: "100%",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  cardUnderlayLeft: {
    position: "absolute",
    width: "97%",
    height: "97%",
    borderRadius: 28,
    backgroundColor: Colors.surface2,
    borderWidth: 1.5,
    borderColor: "rgba(227, 132, 255, 0.18)",
    transform: [{ rotate: "-4.5deg" }, { translateY: -4 }],
    zIndex: 1,
    opacity: 0.65,
  },
  cardUnderlayRight: {
    position: "absolute",
    width: "97%",
    height: "97%",
    borderRadius: 28,
    backgroundColor: Colors.surface2,
    borderWidth: 1.5,
    borderColor: "rgba(134, 93, 255, 0.28)",
    transform: [{ rotate: "4.5deg" }, { translateY: 4 }],
    zIndex: 2,
    opacity: 0.85,
  },
  flashcard: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: Colors.borderAccent,
    padding: 24,
    minHeight: 330,
    justifyContent: "space-between",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.28,
    shadowRadius: 26,
    elevation: 8,
    zIndex: 3,
  },
  cardInner: {
    flex: 1,
    justifyContent: "space-between",
  },
  tagBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: Colors.orchidSoft,
    borderWidth: 1,
    borderColor: Colors.orchidMid,
  },
  tagText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 11,
    color: Colors.accentSecondary,
  },
  cardQuestion: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 21,
    lineHeight: 30,
    color: Colors.inkBright,
    letterSpacing: -0.3,
    marginVertical: 18,
  },
  backTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardAnswer: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 17,
    lineHeight: 26,
    color: Colors.ink,
    marginVertical: 18,
  },
  askButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.accent,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 14,
  },
  askButtonText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 12,
    color: Colors.inkPure,
  },
  flipPrompt: {
    alignItems: "center",
    paddingTop: 8,
  },
  flipPromptText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 12,
    color: Colors.inkDim,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    width: "100%",
  },
  emptyTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 18,
    color: Colors.inkBright,
    marginBottom: 6,
    textAlign: "center",
  },
  emptyText: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 13,
    color: Colors.inkMuted,
    textAlign: "center",
    marginBottom: 16,
  },
  resetSearchBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: Colors.accent,
  },
  resetSearchText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 13,
    color: Colors.inkPure,
  },

  // ── Capsule Navigation Buttons (Uiverse xueyuantan style) ────────────
  controlsRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 96,
    alignItems: "center",
  },
  navButtonSecondary: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: "rgba(227, 132, 255, 0.22)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  navButtonTextSecondary: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 14,
    color: Colors.accentSecondary,
  },
  navButtonPrimary: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.accentSecondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 6,
  },
  navButtonTextPrimary: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 14,
    color: Colors.inkPure,
    letterSpacing: 0.2,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
