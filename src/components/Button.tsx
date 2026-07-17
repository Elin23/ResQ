import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'text';

type Props = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
}: Props) {
  const isInactive = loading || disabled;

  // لون المحتوى (نص وأيقونة): رمادي إذا معطل، وإلا حسب النوع
  const contentColor = isInactive ? COLORS.textSecondary : textColors[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        isInactive && styles.inactive,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <>
          <ActivityIndicator color={COLORS.textSecondary} />
          <AppText style={[styles.label, { color: contentColor }]}>
            جاري المعالجة...
          </AppText>
        </>
      ) : (
        <>
          {icon && <Ionicons name={icon} size={20} color={contentColor} />}
          <AppText style={[styles.label, { color: contentColor }]}>
            {title}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

// لون النص حسب نوع الزر
const textColors: Record<ButtonVariant, string> = {
  primary: '#FFFFFF',
  secondary: '#FFFFFF',
  danger: '#FFFFFF',
  outline: COLORS.primary,
  text: COLORS.primary,
};

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.body,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  inactive: {
    backgroundColor: COLORS.neutral,
    borderWidth: 0,
  },
});

// شكل كل نوع
const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  danger: {
    backgroundColor: COLORS.danger,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.textSecondary,
  },
  text: {
    backgroundColor: 'transparent',
    height: undefined,
    paddingVertical: SPACING.sm,
  },
});