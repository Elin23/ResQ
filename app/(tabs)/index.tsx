<<<<<<< HEAD
export { default } from "@/src/features/home/screens/HomeScreen";
=======
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import AppText from "@/src/components/AppText";
import GuestPromoCard from "@/src/components/GuestPromoCard";
import QuickActionGrid, {
  QuickAction,
} from "@/src/components/QuickActionGrid";
import ReportCallout from "@/src/components/ReportCallout";
import ReportPreviewCard from "@/src/components/ReportPreviewCard";
import Screen from "@/src/components/Screen";
import SectionHeader from "@/src/components/SectionHeader";
import { COLORS, FONT_SIZES, SPACING } from "@/src/constants/theme";
import { getReports } from "@/src/services/reports";
import { Report } from "@/src/types";

const LATEST_REPORTS_COUNT = 3;

export default function HomeScreen() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports()
      .then((data) => setReports(data.slice(0, LATEST_REPORTS_COUNT)))
      .finally(() => setLoading(false));
  }, []);

  const quickActions: QuickAction[] = [
    {
      key: "reports",
      label: "البلاغات",
      icon: "warning",
      color: COLORS.danger,
      onPress: () => router.push("/reports"),
    },
    {
      key: "feeding",
      label: "نقاط الإطعام",
      icon: "location",
      color: COLORS.bggreen,
      onPress: () => router.push("/map"),
    },
    {
      key: "clinics",
      label: "العيادات البيطرية",
      icon: "medkit",
      color: COLORS.bgblue,
      onPress: () => router.push("/map"),
    },
    {
      key: "adoption",
      label: "الحيوانات للتبني",
      icon: "paw",
      color: COLORS.brown,
      onPress: () => router.push("/login"),
    },
  ];

  return (
    <Screen scroll safeAreaEdges={["left", "right"]}>
      <View style={styles.sections}>
        <View style={styles.greeting}>
          <View style={styles.greetingRow}>
            <AppText
              weight="bold"
              size={FONT_SIZES.headline}
              style={styles.greetingText}
            >
              مرحباً بك في ResQ
            </AppText>
            <AppText weight="bold" size={FONT_SIZES.headline}>
              👋
            </AppText>
          </View>

          <AppText color={COLORS.textSecondary} style={styles.subtitle}>
            ساعد الحيوانات المحتاجة أو استكشف البلاغات القريبة منك.
          </AppText>
        </View>

        <ReportCallout onReportPress={() => router.push("/reports")} />

        <QuickActionGrid actions={quickActions} />

        <View style={styles.reportsSection}>
          <SectionHeader
            title="أحدث البلاغات"
            actionLabel="عرض الكل"
            onActionPress={() => router.push("/reports")}
          />

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <View style={styles.reportsList}>
              {reports.map((report) => (
                <ReportPreviewCard
                  key={report.id}
                  report={report}
                  onPress={() => router.push("/reports")}
                />
              ))}
            </View>
          )}
        </View>

        <GuestPromoCard
          onCreateAccount={() => router.push("/choose-account")}
          onLogin={() => router.push("/login")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sections: {
    width: "100%",
    gap: SPACING.xl,
  },
  greeting: {
    width: "100%",
  },
  subtitle: {
    width: "100%",
    marginTop: SPACING.xs,
    textAlign: "auto",
  },
  reportsSection: {
    width: "100%",
  },
  reportsList: {
    width: "100%",
    gap: SPACING.md,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  greetingText: {
    textAlign: "right",
  },
});
>>>>>>> 5f4a354c8632b09b2c8785d2eebd30ffed989cf6
