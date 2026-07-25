import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from "../constants/theme";
import AppText from "./AppText";
import Card from "./Card";

export type QuickAction = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
};

type Props = {
  actions: QuickAction[];
};

export default function QuickActionGrid({ actions }: Props) {
  return (
    <View style={styles.grid}>
      {actions.map((action) => (
        <Card
          key={action.key}
          onPress={action.onPress}
          backgroundColor={COLORS.lightgray}
          style={styles.cell}
        >
          <View
            style={[styles.iconCircle, { backgroundColor: action.color + "22" }]}
          >
            <Ionicons name={action.icon} size={22} color={action.color} />
          </View>

          <AppText style={styles.label} numberOfLines={1}>
            {action.label}
          </AppText>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },
  cell: {
    width: "47%",
    marginBottom: 0,
    alignItems: "center",
    gap: SPACING.sm,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.body,
    textAlign: "center",
  },
});
