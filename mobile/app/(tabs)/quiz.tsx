/**
 * GenBrain — Quiz Screen
 *
 * Clean multiple-choice quiz with full lifecycle controls:
 * - Capsule gradient buttons (Uiverse xueyuantan style) for Start and Play Again
 * - Fluid Plus Jakarta Sans typography
 * - Color Hunt palette (#191825, #865DFF, #E384FF, #FFA3FD)
 * - Idle: Start screen with clear challenge overview
 * - Active: Timer, questions, answer feedback
 * - Paused: Timer frozen, question blurred, "Resume" overlay
 * - Done: Results with XP award and "Play Again" button
 */

import { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AppState,
  type AppStateStatus,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Rect } from "react-native-svg";

import { Colors } from "../../constants/colors";
import { useGameStore, calculateRank } from "../../store/useGameStore";

// ── Quiz States ──────────────────────────────────────────────────────────

type QuizState = "idle" | "active" | "paused" | "done";

// ── Question Pool ────────────────────────────────────────────────────────

const QUIZ_POOL = [
  {
    subject: "Space",
    question: "Which planet rotates on its side, with an axial tilt of about 98°?",
    options: [
      { key: "A", text: "Neptune" },
      { key: "B", text: "Uranus" },
      { key: "C", text: "Saturn" },
      { key: "D", text: "Mercury" },
    ],
    correct: "B",
  },
  {
    subject: "History",
    question: "The Great Fire of London took place in which year?",
    options: [
      { key: "A", text: "1492" },
      { key: "B", text: "1666" },
      { key: "C", text: "1720" },
      { key: "D", text: "1801" },
    ],
    correct: "B",
  },
  {
    subject: "Science",
    question: "What is the most abundant gas in Earth's atmosphere?",
    options: [
      { key: "A", text: "Oxygen" },
      { key: "B", text: "Carbon dioxide" },
      { key: "C", text: "Nitrogen" },
      { key: "D", text: "Argon" },
    ],
    correct: "C",
  },
  {
    subject: "Geography",
    question: "Which country has the most time zones?",
    options: [
      { key: "A", text: "Russia" },
      { key: "B", text: "USA" },
      { key: "C", text: "France" },
      { key: "D", text: "China" },
    ],
    correct: "C",
  },
  {
    subject: "Nature",
    question: "What is the largest living organism on Earth by area?",
    options: [
      { key: "A", text: "Blue whale" },
      { key: "B", text: "Giant sequoia" },
      { key: "C", text: "Honey fungus" },
      { key: "D", text: "Great Barrier Reef" },
    ],
    correct: "C",
  },
];

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const xp = useGameStore((s) => s.xp);
  const rank = calculateRank(xp);
  const addXp = useGameStore((s) => s.addXp);
  const recordMiss = useGameStore((s) => s.recordMiss);
  const bumpQuest = useGameStore((s) => s.bumpQuest);

  const questions = useMemo(() => QUIZ_POOL.slice(0, 5), []);

  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [time, setTime] = useState(20);
  const [correctCount, setCorrectCount] = useState(0);
  const appState = useRef(AppState.currentState);

  const q = questions[step];
  const answered = picked !== null;
  const isLast = step === questions.length - 1;

  // ── AppState listener: auto-pause when backgrounded ──────────────────
  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (
        appState.current === "active" &&
        (nextState === "background" || nextState === "inactive")
      ) {
        setQuizState((prev) => (prev === "active" ? "paused" : prev));
      }
      appState.current = nextState;
    };

    const sub = AppState.addEventListener("change", handleAppState);
    return () => sub.remove();
  }, []);

  // ── Timer countdown ──────────────────────────────────────────────────
  useEffect(() => {
    if (quizState !== "active" || picked || !q) return;
    if (time === 0) {
      setPicked("__timeout__");
      recordMiss(q.subject);
      return;
    }
    const id = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [time, picked, quizState, q?.subject, recordMiss]);

  // ── Actions ──────────────────────────────────────────────────────────

  const startQuiz = () => {
    setStep(0);
    setPicked(null);
    setTime(20);
    setCorrectCount(0);
    setQuizState("active");
  };

  const pauseQuiz = () => setQuizState("paused");
  const resumeQuiz = () => setQuizState("active");

  const endQuiz = () => {
    const perfect = correctCount === step;
    addXp(perfect && step > 0 ? 90 : Math.max(15, step * 15), perfect ? "quiz_perfect" : "quiz_pass");
    if (perfect && step === questions.length) bumpQuest("perfect", 1);
    setQuizState("done");
  };

  const choose = (key: string) => {
    if (answered || quizState !== "active") return;
    setPicked(key);
    if (key === q.correct) setCorrectCount((c) => c + 1);
    else recordMiss(q.subject);
  };

  const next = () => {
    if (isLast) {
      const perfect = correctCount + (picked === q.correct ? 1 : 0) === questions.length;
      addXp(perfect ? 90 : 45, perfect ? "quiz_perfect" : "quiz_pass");
      if (perfect) bumpQuest("perfect", 1);
      setQuizState("done");
      return;
    }
    setStep((s) => s + 1);
    setPicked(null);
    setTime(20);
  };

  // ═══════════════════════════════════════════════════════════════════════
  // STATE: IDLE — Start Screen
  // ═══════════════════════════════════════════════════════════════════════

  if (quizState === "idle") {
    return (
      <View style={[styles.idleContainer, { paddingTop: Math.max(insets.top + 16, 32) }]}>
        <View style={styles.idleContent}>
          <View style={styles.idleBadge}>
            <Text style={styles.idleBadgeText}>?</Text>
          </View>
          <Text style={styles.idleTitle}>Daily Quiz Challenge</Text>
          <Text style={styles.idleSubtitle}>5 quick general knowledge questions</Text>
          <View style={styles.idleStats}>
            <View style={styles.idleStat}>
              <Text style={styles.idleStatValue}>{questions.length}</Text>
              <Text style={styles.idleStatLabel}>Questions</Text>
            </View>
            <View style={styles.idleStatDivider} />
            <View style={styles.idleStat}>
              <Text style={styles.idleStatValue}>20s</Text>
              <Text style={styles.idleStatLabel}>Per question</Text>
            </View>
            <View style={styles.idleStatDivider} />
            <View style={styles.idleStat}>
              <Text style={styles.idleStatValue}>+90</Text>
              <Text style={styles.idleStatLabel}>Max XP</Text>
            </View>
          </View>
        </View>

        {/* Capsule Gradient Start Button (Uiverse xueyuantan style) */}
        <TouchableOpacity onPress={startQuiz} style={styles.startButton} activeOpacity={0.85}>
          <View style={StyleSheet.absoluteFillObject}>
            <Svg width="100%" height="100%" preserveAspectRatio="none">
              <Defs>
                <SvgGradient id="startBtnGrad" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor="#865DFF" />
                  <Stop offset="100%" stopColor="#E384FF" />
                </SvgGradient>
              </Defs>
              <Rect width="100%" height="100%" rx={26} fill="url(#startBtnGrad)" />
            </Svg>
          </View>
          <Text style={styles.startButtonText}>Start Quiz →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STATE: DONE — Results Screen
  // ═══════════════════════════════════════════════════════════════════════

  if (quizState === "done") {
    const perfect = correctCount === questions.length;
    return (
      <View style={[styles.resultContainer, { paddingTop: Math.max(insets.top, 24) }]}>
        <View style={styles.resultBadge}>
          <Text style={styles.resultBadgeText}>{rank.tier}</Text>
        </View>
        <Text style={styles.resultTitle}>
          {perfect ? "Flawless Score!" : "Quiz Complete"}
        </Text>
        <Text style={styles.resultScore}>
          {correctCount} of {questions.length} correct
        </Text>
        <View style={styles.xpAward}>
          <Text style={styles.xpAwardText}>
            +{perfect ? 90 : 45} XP
          </Text>
        </View>

        {/* Capsule Gradient Play Again Button (Uiverse xueyuantan style) */}
        <TouchableOpacity onPress={startQuiz} style={styles.continueButton} activeOpacity={0.85}>
          <View style={StyleSheet.absoluteFillObject}>
            <Svg width="100%" height="100%" preserveAspectRatio="none">
              <Defs>
                <SvgGradient id="continueBtnGrad" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor="#865DFF" />
                  <Stop offset="100%" stopColor="#E384FF" />
                </SvgGradient>
              </Defs>
              <Rect width="100%" height="100%" rx={26} fill="url(#continueBtnGrad)" />
            </Svg>
          </View>
          <Text style={styles.continueButtonText}>Play Again →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STATE: ACTIVE / PAUSED — Quiz In-Progress
  // ═══════════════════════════════════════════════════════════════════════

  const pct = ((step + (answered ? 1 : 0)) / questions.length) * 100;
  const low = time <= 5;

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top + 8, 20) }]}>
      {/* Header with Pause / End controls */}
      <View style={styles.quizHeader}>
        <Text style={styles.stepLabel}>
          Question {step + 1} of {questions.length}
        </Text>
        <View style={styles.controlRow}>
          {quizState === "active" && (
            <TouchableOpacity onPress={pauseQuiz} style={styles.controlButton}>
              <Text style={styles.controlButtonText}>Pause</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={endQuiz} style={styles.endButton}>
            <Text style={styles.endButtonText}>End</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>
        <View style={[styles.timerPill, low && styles.timerPillLow]}>
          <Text style={[styles.timerText, low && styles.timerTextLow]}>
            {time}s
          </Text>
        </View>
      </View>

      {/* Question */}
      <View style={[styles.questionArea, quizState === "paused" && styles.blurred]}>
        <Text style={styles.subjectLabel}>{q.subject}</Text>
        <Text style={styles.questionText}>{q.question}</Text>
      </View>

      {/* Options */}
      <View style={[styles.optionsArea, quizState === "paused" && styles.blurred]}>
        {q.options.map((o) => {
          const isPicked = picked === o.key;
          const isCorrect = o.key === q.correct;
          let optStyle = styles.optionIdle;
          let textStyle = styles.optionTextIdle;

          if (answered) {
            if (isCorrect) {
              optStyle = styles.optionCorrect;
              textStyle = styles.optionTextCorrect;
            } else if (isPicked) {
              optStyle = styles.optionWrong;
              textStyle = styles.optionTextIdle;
            } else {
              optStyle = styles.optionDim;
              textStyle = styles.optionTextDim;
            }
          }

          return (
            <TouchableOpacity
              key={o.key}
              onPress={() => choose(o.key)}
              disabled={answered || quizState === "paused"}
              style={[styles.option, optStyle]}
              activeOpacity={0.8}
            >
              <View style={[styles.optionKey, answered && isCorrect && styles.optionKeyCorrect]}>
                <Text style={[styles.optionKeyText, answered && isCorrect && styles.optionKeyTextCorrect]}>
                  {answered && isCorrect ? "✓" : o.key}
                </Text>
              </View>
              <Text style={[styles.optionText, textStyle]}>{o.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Pause Overlay */}
      {quizState === "paused" && (
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseCard}>
            <Text style={styles.pauseTitle}>Quiz Paused</Text>
            <Text style={styles.pauseSub}>Timer is frozen. Take your time.</Text>
            <TouchableOpacity onPress={resumeQuiz} style={styles.resumeButton}>
              <Text style={styles.resumeButtonText}>Resume Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={endQuiz} style={styles.quitButton}>
              <Text style={styles.quitButtonText}>End Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Next button / hint */}
      <View style={styles.bottomArea}>
        {answered && quizState === "active" ? (
          <TouchableOpacity onPress={next} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>
              {isLast ? "Finish Quiz" : "Next Question →"}
            </Text>
          </TouchableOpacity>
        ) : quizState === "active" ? (
          <Text style={styles.hintText}>
            Choose the correct option before time runs out
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Idle ─────────────────────────────────────────────────────────────
  idleContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 96,
  },
  idleContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  idleBadge: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.accentSecondary,
  },
  idleBadgeText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 28,
    color: Colors.accentSecondary,
  },
  idleTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 24,
    color: Colors.inkBright,
    marginTop: 20,
    letterSpacing: -0.4,
  },
  idleSubtitle: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 14,
    color: Colors.inkMuted,
    marginTop: 4,
  },
  idleStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
    gap: 16,
  },
  idleStat: {
    alignItems: "center",
  },
  idleStatValue: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 19,
    color: Colors.inkBright,
  },
  idleStatLabel: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 11,
    color: Colors.inkDim,
    marginTop: 2,
  },
  idleStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  startButton: {
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: Colors.accentSecondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 16,
    color: Colors.inkPure,
    letterSpacing: 0.3,
  },

  // ── Active ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: 22,
    paddingBottom: 88,
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
  stepLabel: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 13,
    color: Colors.inkMuted,
  },
  controlRow: {
    flexDirection: "row",
    gap: 8,
  },
  controlButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.orchidMid,
    backgroundColor: Colors.orchidSoft,
  },
  controlButtonText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 11,
    color: Colors.accentSecondary,
  },
  endButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,92,122,0.35)",
    backgroundColor: Colors.errorSoft,
  },
  endButtonText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 11,
    color: Colors.error,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 14,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surface,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  timerPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timerPillLow: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorSoft,
  },
  timerText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 12,
    color: Colors.inkBright,
  },
  timerTextLow: { color: Colors.error },
  questionArea: { marginTop: 28 },
  blurred: { opacity: 0.12 },
  subjectLabel: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 11,
    color: Colors.accentSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  questionText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 20,
    lineHeight: 28,
    color: Colors.inkBright,
    marginTop: 10,
    letterSpacing: -0.3,
  },
  optionsArea: {
    marginTop: 28,
    gap: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionIdle: {
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  optionCorrect: {
    borderColor: "transparent",
    backgroundColor: Colors.accent,
  },
  optionWrong: {
    borderColor: "rgba(255,92,122,0.6)",
    backgroundColor: Colors.errorSoft,
  },
  optionDim: {
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    opacity: 0.45,
  },
  optionKey: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.surface2,
    justifyContent: "center",
    alignItems: "center",
  },
  optionKeyCorrect: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  optionKeyText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 12,
    color: Colors.inkMuted,
  },
  optionKeyTextCorrect: { color: Colors.inkPure },
  optionText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 15,
    flex: 1,
  },
  optionTextIdle: { color: Colors.ink },
  optionTextCorrect: { color: Colors.inkPure },
  optionTextDim: { color: Colors.inkDim },

  // ── Pause Overlay ───────────────────────────────────────────────────
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(25, 24, 37, 0.88)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  pauseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    alignItems: "center",
    width: "85%",
  },
  pauseTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 20,
    color: Colors.inkBright,
  },
  pauseSub: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 13,
    color: Colors.inkMuted,
    textAlign: "center",
    marginTop: 6,
  },
  resumeButton: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 18,
    width: "100%",
    alignItems: "center",
  },
  resumeButtonText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 14,
    color: Colors.inkPure,
  },
  quitButton: {
    marginTop: 10,
    paddingVertical: 8,
  },
  quitButtonText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 12,
    color: Colors.error,
  },

  // ── Bottom / Next ───────────────────────────────────────────────────
  bottomArea: {
    marginTop: "auto",
    paddingTop: 20,
  },
  nextButton: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  nextButtonText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 15,
    color: Colors.inkPure,
  },
  hintText: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 12,
    color: Colors.inkDim,
    textAlign: "center",
  },

  // ── Results ─────────────────────────────────────────────────────────
  resultContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingBottom: 96,
  },
  resultBadge: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.accentSecondary,
  },
  resultBadgeText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 22,
    color: Colors.accentSecondary,
  },
  resultTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 22,
    color: Colors.inkBright,
    marginTop: 18,
  },
  resultScore: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: Colors.inkMuted,
    marginTop: 6,
  },
  xpAward: {
    backgroundColor: Colors.accentSoft,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 14,
  },
  xpAwardText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 16,
    color: Colors.accentHighlight,
  },
  continueButton: {
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 24,
    shadowColor: Colors.accentSecondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  continueButtonText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 16,
    color: Colors.inkPure,
    letterSpacing: 0.3,
  },
});
