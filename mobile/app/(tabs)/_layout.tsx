/**
 * GenBrain — Floating Pill Tab Navigator Layout
 *
 * Inspired by Uiverse floating glassmorphic pill navigation bar:
 * - Floating rounded-full pill design with backdrop blur / opacity
 * - Color Hunt palette (#191825, #865DFF, #E384FF, #FFA3FD)
 * - Tactile active tab state with subtle glowing pill highlight
 * - Four tabs: Cards (Home), Quiz, News, Profile
 */

import { Tabs } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import Svg, { Rect, Path, Circle, Line } from "react-native-svg";

import { Colors } from "../../constants/colors";

// ── Tab Icons (SVG) ──────────────────────────────────────────────────────

function CardsIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function QuizIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} />
      <Path
        d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 1.2-1.5 1.8-1.5 2.8v.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Circle cx="12.5" cy="17" r="0.9" fill={color} />
    </Svg>
  );
}

function NewsIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3.5" width="18" height="17" rx="3" stroke={color} strokeWidth={1.8} />
      <Line x1="7" y1="8" x2="17" y2="8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="7" y1="12" x2="14" y2="12" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="7" y1="16" x2="11" y2="16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function ProfileIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.8} />
      <Path
        d="M4.5 19.5c1.4-3.5 4.2-5 7.5-5s6.1 1.5 7.5 5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === "ios" ? 28 : 20,
          left: 24,
          right: 24,
          height: 64,
          borderRadius: 36,
          backgroundColor: "rgba(25, 24, 37, 0.92)",
          borderWidth: 1,
          borderColor: "rgba(227, 132, 255, 0.2)",
          paddingBottom: 0,
          paddingHorizontal: 8,
          alignItems: "center",
          justifyContent: "space-around",
          shadowColor: "#865DFF",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.35,
          shadowRadius: 22,
          elevation: 12,
        },
        tabBarActiveTintColor: Colors.accentHighlight,
        tabBarInactiveTintColor: Colors.inkDim,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: "PlusJakartaSans_600SemiBold",
          fontSize: 10,
          marginTop: -2,
          marginBottom: 4,
        },
        tabBarItemStyle: {
          height: 52,
          paddingVertical: 4,
          borderRadius: 26,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Cards",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <CardsIcon color={focused ? Colors.accentHighlight : color} size={20} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: "Quiz",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <QuizIcon color={focused ? Colors.accentHighlight : color} size={20} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: "News",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <NewsIcon color={focused ? Colors.accentHighlight : color} size={20} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <ProfileIcon color={focused ? Colors.accentHighlight : color} size={20} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapperActive: {
    backgroundColor: "rgba(134, 93, 255, 0.22)",
  },
});
