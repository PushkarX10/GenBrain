/**
 * GenBrain — Kihoro AI Tutor Chat Overlay Modal
 *
 * Clean conversational interface with Kihoro:
 * - Premium Tech typography: Space Grotesk + Plus Jakarta Sans
 * - Color Hunt palette (#191825, #865DFF, #E384FF, #FFA3FD)
 * - Guaranteed unique React keys for messages and suggestions
 * - Message history stream
 * - Suggestion chips
 * - Direct text entry for follow-up questions
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Colors } from "../../constants/colors";
import { useAITutor } from "../../hooks/useAITutor";

export default function ChatModal() {
  const {
    messages,
    isTyping,
    isOpen,
    cardContext,
    closeChat,
    sendMessage,
    getSuggestions,
  } = useAITutor();

  const [input, setInput] = useState("");

  if (!isOpen || !cardContext) return null;

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInput("");
  };

  const suggestions = getSuggestions();

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={closeChat}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Kihoro AI Header */}
          <View style={styles.header}>
            <View style={styles.identityLeft}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>K</Text>
              </View>
              <View>
                <Text style={styles.tutorName}>Kihoro</Text>
                <Text style={styles.tutorSub}>Local AI Tutor · On-Device</Text>
              </View>
            </View>
            <TouchableOpacity onPress={closeChat} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Messages Stream */}
          <ScrollView
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              const key = m.id ? m.id : `msg-${idx}-${m.role}`;
              return (
                <View
                  key={key}
                  style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.aiBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isUser ? styles.userText : styles.aiText,
                    ]}
                  >
                    {m.text}
                  </Text>
                </View>
              );
            })}
            {isTyping && (
              <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
                <ActivityIndicator size="small" color={Colors.accentSecondary} />
                <Text style={styles.typingText}>Kihoro is thinking…</Text>
              </View>
            )}
          </ScrollView>

          {/* Suggestions & Input */}
          <View style={styles.inputArea}>
            {suggestions.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionsContainer}
              >
                {suggestions.map((s, idx) => (
                  <TouchableOpacity
                    key={`sug-${idx}-${s}`}
                    onPress={() => handleSend(s)}
                    style={styles.chip}
                  >
                    <Text style={styles.chipText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                value={input}
                onChangeText={setInput}
                placeholder="Ask Kihoro a follow-up…"
                placeholderTextColor={Colors.inkDim}
                onSubmitEditing={() => handleSend(input)}
              />
              <TouchableOpacity
                onPress={() => handleSend(input)}
                disabled={!input.trim()}
                style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
              >
                <Text style={styles.sendIcon}>➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(25, 24, 37, 0.88)",
    justifyContent: "flex-end",
  },
  container: {
    height: "88%",
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  identityLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.accentSecondary,
  },
  avatarText: {
    fontFamily: "SpaceGrotesk_700Bold",
    fontSize: 19,
    color: Colors.inkPure,
  },
  tutorName: {
    fontFamily: "SpaceGrotesk_700Bold",
    fontSize: 18,
    color: Colors.inkBright,
  },
  tutorSub: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 11,
    color: Colors.accentSecondary,
    marginTop: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  closeText: {
    color: Colors.inkMuted,
    fontSize: 14,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    gap: 12,
    paddingVertical: 12,
  },
  messageBubble: {
    maxWidth: "84%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: Colors.accent,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typingText: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 12,
    color: Colors.inkMuted,
  },
  messageText: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 14,
    lineHeight: 21,
  },
  userText: {
    color: Colors.inkPure,
  },
  aiText: {
    color: Colors.ink,
  },
  inputArea: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  suggestionsContainer: {
    gap: 8,
    paddingBottom: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 12,
    color: Colors.accentSecondary,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textInput: {
    flex: 1,
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 14,
    color: Colors.inkBright,
    paddingVertical: 6,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: Colors.surface2,
  },
  sendIcon: {
    color: Colors.inkPure,
    fontSize: 14,
  },
});
