/**
 * GenBrain — Daily News Tab
 *
 * Clean scrollable world news feed:
 * - Fluid Plus Jakarta Sans typography
 * - Color Hunt palette (#191825, #865DFF, #E384FF, #FFA3FD)
 * - Category filter chips in dedicated non-overlapping horizontal container
 * - Modern article cards with source badges and external link handlers
 */

import { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";

// ── News Categories ──────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "world", label: "World" },
  { id: "tech", label: "Tech" },
  { id: "science", label: "Science" },
  { id: "business", label: "Business" },
  { id: "sports", label: "Sports" },
  { id: "health", label: "Health" },
];

// ── Sample News Articles ─────────────────────────────────────────────────

interface NewsArticle {
  id: string;
  category: string;
  source: string;
  headline: string;
  summary: string;
  timestamp: string;
  url: string;
}

const SAMPLE_NEWS: NewsArticle[] = [
  {
    id: "n-1",
    category: "world",
    source: "Reuters",
    headline: "UN Climate Summit Reaches Historic Agreement on Carbon Credits",
    summary:
      "Over 190 nations have agreed on a new framework for international carbon credit trading, marking the first major update to the system since the Paris Agreement.",
    timestamp: "2h ago",
    url: "https://reuters.com",
  },
  {
    id: "n-2",
    category: "tech",
    source: "Ars Technica",
    headline: "Quantum Computer Achieves New Milestone in Error Correction",
    summary:
      "Researchers demonstrate a quantum processor that can reliably correct its own errors, bringing practical quantum computing closer to reality.",
    timestamp: "4h ago",
    url: "https://arstechnica.com",
  },
  {
    id: "n-3",
    category: "science",
    source: "Nature",
    headline: "Deep Ocean Expedition Discovers New Species of Bioluminescent Fish",
    summary:
      "A team of marine biologists has cataloged 12 previously unknown species at depths exceeding 4,000 meters in the Pacific Ocean.",
    timestamp: "5h ago",
    url: "https://nature.com",
  },
  {
    id: "n-4",
    category: "business",
    source: "Bloomberg",
    headline: "Global Chip Shortage Expected to Ease by Late 2026",
    summary:
      "Major semiconductor manufacturers report significant capacity expansions, with new fabrication facilities coming online across Asia and Europe.",
    timestamp: "6h ago",
    url: "https://bloomberg.com",
  },
  {
    id: "n-5",
    category: "sports",
    source: "ESPN",
    headline: "Record-Breaking Marathon Time Set at Berlin Event",
    summary:
      "Ethiopian runner shatters the world marathon record by 47 seconds, finishing in under 1 hour 58 minutes in ideal conditions.",
    timestamp: "8h ago",
    url: "https://espn.com",
  },
  {
    id: "n-6",
    category: "health",
    source: "WHO",
    headline: "New mRNA Vaccine Shows 95% Efficacy Against Malaria in Trials",
    summary:
      "Phase III clinical trials of the mRNA-based malaria vaccine demonstrate unprecedented protection rates, offering hope for endemic regions.",
    timestamp: "10h ago",
    url: "https://who.int",
  },
  {
    id: "n-7",
    category: "world",
    source: "BBC",
    headline: "Unprecedented Coral Reef Recovery Documented in Great Barrier Reef",
    summary:
      "Scientists report significant coral regrowth in previously bleached areas, crediting improved water quality and reduced carbon emissions.",
    timestamp: "12h ago",
    url: "https://bbc.com",
  },
  {
    id: "n-8",
    category: "tech",
    source: "TechCrunch",
    headline: "Open-Source AI Model Outperforms Leading Proprietary Systems",
    summary:
      "A community-developed language model matches GPT-class performance on major benchmarks while running on consumer hardware.",
    timestamp: "14h ago",
    url: "https://techcrunch.com",
  },
  {
    id: "n-9",
    category: "science",
    source: "NASA",
    headline: "James Webb Telescope Captures First Direct Image of an Exoplanet Atmosphere",
    summary:
      "Spectroscopic analysis reveals water vapor and methane in the atmosphere of a rocky exoplanet 40 light-years away.",
    timestamp: "16h ago",
    url: "https://nasa.gov",
  },
  {
    id: "n-10",
    category: "health",
    source: "The Lancet",
    headline: "Study Links Gut Microbiome Diversity to Improved Mental Health",
    summary:
      "A 10,000-participant longitudinal study finds that greater microbial diversity correlates with lower rates of anxiety and depression.",
    timestamp: "18h ago",
    url: "https://thelancet.com",
  },
];

export default function NewsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredNews = useMemo(() => {
    if (selectedCategory === "all") return SAMPLE_NEWS;
    return SAMPLE_NEWS.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  const openArticle = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top + 8, 20) }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>World News</Text>
        <Text style={styles.headerSubtitle}>Curated daily briefings</Text>
      </View>

      {/* Category Filter Chips Container */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[styles.chip, active && styles.chipActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* News Articles */}
      <ScrollView
        style={styles.articleScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articleList}
      >
        {filteredNews.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No articles in this category</Text>
          </View>
        ) : (
          filteredNews.map((article) => (
            <TouchableOpacity
              key={article.id}
              onPress={() => openArticle(article.url)}
              style={styles.articleCard}
              activeOpacity={0.88}
            >
              <View style={styles.articleMeta}>
                <View style={styles.sourceBadge}>
                  <Text style={styles.sourceText}>{article.source}</Text>
                </View>
                <Text style={styles.timestamp}>{article.timestamp}</Text>
              </View>
              <Text style={styles.headline}>{article.headline}</Text>
              <Text style={styles.summary} numberOfLines={3}>
                {article.summary}
              </Text>
              <View style={styles.readMoreRow}>
                <Text style={styles.categoryTag}>
                  {article.category}
                </Text>
                <Text style={styles.readMore}>Read article →</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: 22,
  },
  header: {
    paddingTop: 6,
    paddingBottom: 4,
  },
  headerTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 24,
    color: Colors.inkBright,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 13,
    color: Colors.inkMuted,
    marginTop: 2,
  },
  filterWrapper: {
    paddingVertical: 12,
    height: 60,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 16,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  chipActive: {
    backgroundColor: Colors.accent,
    borderColor: "transparent",
  },
  chipText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 12,
    color: Colors.inkMuted,
  },
  chipTextActive: {
    color: Colors.inkPure,
  },
  articleScroll: {
    flex: 1,
  },
  articleList: {
    gap: 14,
    paddingTop: 4,
    paddingBottom: 104,
  },
  articleCard: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18,
  },
  articleMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sourceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: Colors.orchidSoft,
    borderWidth: 1,
    borderColor: Colors.orchidMid,
  },
  sourceText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 10,
    color: Colors.accentSecondary,
  },
  timestamp: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 11,
    color: Colors.inkDim,
  },
  headline: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 17,
    lineHeight: 24,
    color: Colors.inkBright,
    letterSpacing: -0.3,
  },
  summary: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: Colors.inkMuted,
    marginTop: 8,
  },
  readMoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  categoryTag: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 11,
    color: Colors.accentHighlight,
    textTransform: "capitalize",
  },
  readMore: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 12,
    color: Colors.accentSecondary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 14,
    color: Colors.inkMuted,
  },
});
