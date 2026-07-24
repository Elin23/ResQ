import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TopBar from "@/src/components/TopBar";
import { COLORS, FONTS } from "@/src/constants/theme";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        header: () => <TopBar />,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          height: 64 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.regular,
          fontSize: 11,
        },
        tabBarActiveBackgroundColor: COLORS.primary,
        tabBarItemStyle: {
          borderRadius: 14,
          marginHorizontal: 6,
          overflow: "hidden",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: "البلاغات",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="warning" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "الخريطة",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="adoption"
        options={{
          title: "المتطوعون",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "حسابي",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
