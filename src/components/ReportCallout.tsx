import { StyleSheet, View } from "react-native";

import { COLORS, FONT_SIZES, RADIUS, SPACING } from "../constants/theme";
import AppText from "./AppText";
import Button from "./Button";

type Props = {
  onReportPress: () => void;
};

export default function ReportCallout({ onReportPress }: Props) {
  return (
    <View style={styles.card}>
      <AppText weight="bold" size={FONT_SIZES.title} color={COLORS.white}>
        هل شاهدت حيواناً بحاجة للمساعدة؟
      </AppText>

      <AppText color={COLORS.white + "CC"} style={styles.subtitle}>
        يمكنك إرسال بلاغ طارئ خلال دقائق.
      </AppText>

      <Button
        title="إرسال بلاغ"
        onPress={onReportPress}
        variant="custom"
        size="medium"
        // icon="paper-plane-outline"
        iconPosition="end"
        fullWidth={false}
        backgroundColor={COLORS.brown}
        textColor={COLORS.white}
        radius={RADIUS.full}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 196,
    alignItems: "flex-start",
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  subtitle: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  button: {
    alignSelf: "flex-start",
  },
});
