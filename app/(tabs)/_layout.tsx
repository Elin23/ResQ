import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppText from "@/src/components/AppText";
import TopBar from "@/src/components/TopBar";
import { COLORS, FONT_SIZES, RADIUS } from "@/src/constants/theme";

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({
  focused,
  color,
  name,
}: {
  focused: boolean;
  color: string;
  name: IconName;
}) {
  return (
    <View style={focused ? styles.activeIconPill : styles.iconWrap}>
      <Ionicons name={name} size={22} color={focused ? COLORS.white : color} />
    </View>
  );
}

function TabLabel({ focused, color, children }: { focused: boolean; color: string; children: string }) {
  return (
    <AppText
      weight={focused ? "bold" : "regular"}
      size={FONT_SIZES.caption}
      color={color}
      style={styles.label}
    >
      {children}
    </AppText>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        header: () => <TopBar />,
        tabBarActiveTintColor: COLORS.brownDark,
        tabBarInactiveTintColor: COLORS.text,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: "#DDC1B3",
          borderTopLeftRadius: RADIUS.xl,
          borderTopRightRadius: RADIUS.xl,
          height: 73 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
          paddingTop: 10,
        },
        // React Navigation reserves a small fixed-size box (31x28) for each
        // tab's icon and centers our custom TabIcon inside it. The active
        // pill needs room to sit inside that box instead of overflowing it,
        // since overflowing content gets clipped under the New Architecture
        // (newArchEnabled in app.json) on Android.
        tabBarIconStyle: {
          width: 44,
          height: 36,
        },
      }}
    >
      {/*
        Global forceRTL mirrors this row the same way it mirrors every other
        "row" container in the app (see index.tsx): the first screen below
        lands on the physical right, the last on the physical left. Listed in
        logical order [Home, Explore, Map, More] so the on-screen result is
        Home on the right, matching the design mirrored from its LTR mockup.
      */}
      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} name={focused ? "home" : "home-outline"} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <TabLabel focused={focused} color={color}>
              الرئيسية
            </TabLabel>
          ),
        }}
      />

      <Tabs.Screen
        name="adoption"
        options={{
          title: "استكشاف",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} name={focused ? "compass" : "compass-outline"} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <TabLabel focused={focused} color={color}>
              استكشاف
            </TabLabel>
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "الخريطة",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} name={focused ? "map" : "map-outline"} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <TabLabel focused={focused} color={color}>
              الخريطة
            </TabLabel>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "المزيد",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={color}
              name={focused ? "ellipsis-horizontal" : "ellipsis-horizontal-outline"}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <TabLabel focused={focused} color={color}>
              المزيد
            </TabLabel>
          ),
        }}
      />

      {/* Kept routable (from the home screen's report CTA) but hidden from the bar — the design only shows 4 tabs. */}
      <Tabs.Screen name="reports" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    paddingVertical: 6,
  },
  activeIconPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  label: {
    marginTop: 4,
  },
});
