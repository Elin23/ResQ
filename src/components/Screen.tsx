// src/components/Screen.tsx
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export default function Screen({ children }: { children: React.ReactNode }) {
  return <SafeAreaView style={styles.safe}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
});
