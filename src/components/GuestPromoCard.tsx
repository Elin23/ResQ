import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { COLORS, FONT_SIZES, SPACING } from "../constants/theme";
import AppText from "./AppText";
import Button from "./Button";
import Card from "./Card";

const BENEFIT_ROWS = [
  ["التبني", "التطوع"],
  ["متابعة البلاغات", "التبرعات"],
];

type Props = {
  onCreateAccount: () => void;
  onLogin: () => void;
};

export default function GuestPromoCard({ onCreateAccount, onLogin }: Props) {
  return (
    <Card disabled backgroundColor={COLORS.surface} style={styles.card}>
      <AppText weight="bold" size={FONT_SIZES.title} style={styles.title}>
        أنشئ حساباً للاستفادة من جميع الميزات
      </AppText>

      <View style={styles.benefitsGrid}>
        {BENEFIT_ROWS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.benefitRow}>
            {row.map((benefit) => (
              <View key={benefit} style={styles.benefitItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={COLORS.secondary}
                />
                <AppText size={FONT_SIZES.body}>{benefit}</AppText>
              </View>
            ))}
          </View>
        ))}
      </View>

      <Button
        title="إنشاء حساب"
        onPress={onCreateAccount}
        variant="primary"
        style={styles.button}
        backgroundColor={COLORS.brown}
      />
      <Button
        title="تسجيل الدخول"
        onPress={onLogin}
        variant="outline"
        style={styles.lastButton}
        backgroundColor={COLORS.background}
        borderColor={COLORS.brown}
        textColor={COLORS.brown}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
    backgroundColor: COLORS.darkgray,
  },
  title: {
    width: "100%",
    marginBottom: SPACING.md,
    textAlign: "auto",
  },
  // Figma specifies this grid's row gap as 12px, which falls between the
  // SPACING.sm (8) and SPACING.md (16) tokens, so it's a literal value here.
  benefitsGrid: {
    width: "100%",
    gap: 12,
    marginBottom: SPACING.lg,
  },
  benefitRow: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  benefitItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  button: {
    marginBottom: SPACING.sm,
  },
  lastButton: {
    marginBottom: 0,
  },
});
