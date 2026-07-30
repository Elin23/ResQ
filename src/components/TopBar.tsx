import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, FONT_SIZES, SPACING } from "../constants/theme";
import AppText from "./AppText";

type Props = {
  onNotificationsPress?: () => void;
  onSearchPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function TopBar({
  onNotificationsPress,
  onSearchPress,
  style,
}: Props) {
  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, style]}>
      <View style={styles.container}>
        <View style={styles.logo}>
          
          <AppText weight="bold" size={FONT_SIZES.title}>
            Res
            <AppText weight="bold" size={FONT_SIZES.title} color={COLORS.primary}>
              Q
            </AppText>
          </AppText>
          <Ionicons name="paw" size={20} color={COLORS.black} />
        </View>

        {/*
          Global forceRTL mirrors every flex "row": the first child lands on
          the physical right, the next on the left. Search is listed before
          notifications so the on-screen order (left to right) comes out as
          notifications, then search — matching the design.
        */}
        <View style={styles.iconGroup}>
          <Pressable
            onPress={onSearchPress}
            hitSlop={8}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="search-outline" size={22} color={COLORS.text} />
          </Pressable>

          <Pressable
            onPress={onNotificationsPress}
            hitSlop={8}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="notifications-off-outline"
              size={22}
              color={COLORS.text}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    width: "100%",
    backgroundColor: COLORS.background,
  },
  container: {
    height: 64,
    paddingHorizontal: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
  },
});
