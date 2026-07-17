import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from './AppText';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';

type Props = {
  onProfilePress?: () => void;
  onNotificationsPress?: () => void;
};

export default function TopBar({ onProfilePress, onNotificationsPress }: Props) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.bar}>
        <Pressable onPress={onProfilePress} style={styles.iconButton}>
          <Ionicons name="person-circle-outline" size={26} color={COLORS.text} />
        </Pressable>

        <View style={styles.logoRow}>
          <Ionicons name="paw" size={22} color={COLORS.primary} />
          <AppText style={styles.logo}>ResQ</AppText>
        </View>

        <Pressable onPress={onNotificationsPress} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: COLORS.background,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: SPACING.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  logo: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.title,
    color: COLORS.primary,
  },
  iconButton: {
    padding: SPACING.xs,
  },
});