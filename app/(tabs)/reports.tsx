<<<<<<< HEAD
export { default } from "@/src/features/reports/screens/ReportsScreen";
=======
// app/(tabs)/reports.tsx
import ReportCard from "@/src/components/ReportCard";
import { getReports } from "@/src/services/reports";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import AppText from "../../src/components/AppText";
import { COLORS, FONT_SIZES, SPACING } from "../../src/constants/theme";
import { Report, ReportStatus } from "../../src/types";

const STATUS_LABELS: Record<ReportStatus, string> = {
  pending: "معلق",
  approved: "معروض للمساعدة",
  closed: "مغلق",
};

const STATUS_COLORS: Record<ReportStatus, string> = {
  pending: COLORS.statusPending,
  approved: COLORS.statusApproved,
  closed: COLORS.statusClosed,
};

export default function ReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={reports}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ReportCard
          report={item}
          onHelpPress={() => console.log("استجابة", item.id)}
        />
      )}
      ListEmptyComponent={
        <AppText style={styles.empty}>ما في بلاغات بعد</AppText>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { backgroundColor: COLORS.background },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    margin: SPACING.md,
    marginBottom: 0,
    overflow: "hidden",
  },
  image: { width: "100%", height: 160 },
  cardBody: { padding: SPACING.md },
  description: {
    fontSize: FONT_SIZES.body,
    marginBottom: SPACING.sm,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  badgeText: {
    color: "#FFF",
    fontSize: FONT_SIZES.label,
  },
  empty: {
    textAlign: "center",
    marginTop: SPACING.xl,
    color: COLORS.textSecondary,
  },
});
>>>>>>> 5f4a354c8632b09b2c8785d2eebd30ffed989cf6
