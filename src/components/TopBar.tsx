import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, FONTS, FONT_SIZES, SPACING } from "../constants/theme";
import AppText from "./AppText";

type IconName = keyof typeof Ionicons.glyphMap;

type Props = {
  title?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  centerComponent?: React.ReactNode;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function TopBar({
  title = "ResQ",
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  leftComponent,
  rightComponent,
  centerComponent,
  backgroundColor = COLORS.background,
  style,
}: Props) {
  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        styles.safe,
        {
          backgroundColor,
        },
        style,
      ]}
    >
      <View style={styles.container}>
        <View style={styles.side}>
          {leftComponent ? (
            leftComponent
          ) : leftIcon ? (
            <Pressable
              onPress={onLeftPress}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name={leftIcon} size={24} color={COLORS.text} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.center}>
          {centerComponent ?? <AppText style={styles.title}>{title}</AppText>}
        </View>

        <View style={styles.side}>
          {rightComponent ? (
            rightComponent
          ) : rightIcon ? (
            <Pressable
              onPress={onRightPress}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name={rightIcon} size={24} color={COLORS.text} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    width: "100%",
  },
  container: {
    minHeight: 60,
    paddingHorizontal: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
  },
  side: {
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.title,
    color: COLORS.primary,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
});
