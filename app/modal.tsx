<<<<<<< HEAD
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import { COLORS, SPACING } from "@/src/theme";

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AppText weight="bold" size={24} style={styles.title}>
        نافذة ResQ
      </AppText>
      <AppText color={COLORS.textSecondary} style={styles.description}>
        يمكن استخدام هذا المسار لاحقًا للنوافذ العامة داخل التطبيق.
      </AppText>
      <Button title="إغلاق" onPress={() => router.back()} />
    </View>
=======
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">This is a modal</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
>>>>>>> 5f4a354c8632b09b2c8785d2eebd30ffed989cf6
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    justifyContent: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  title: { marginBottom: SPACING.sm },
  description: { marginBottom: SPACING.lg },
=======
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
>>>>>>> 5f4a354c8632b09b2c8785d2eebd30ffed989cf6
});
