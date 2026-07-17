import { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';

type Props = TextInputProps & {
  label?: string;                          // العنوان فوق الحقل
  icon?: keyof typeof Ionicons.glyphMap;   // أيقونة اختيارية (البحث)
  error?: string;                          // رسالة خطأ تحت الحقل
  prefix?: string;                         // خانة ثابتة متل +963
  password?: boolean;                      // حقل كلمة مرور مع زر العين
};

export default function Input({
  label,
  icon,
  error,
  prefix,
  password = false,
  multiline,
  style,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);  
  const [hidden, setHidden] = useState(true);     

  return (
    <View style={styles.wrapper}>
      {label && <AppText style={styles.label}>{label}</AppText>}

      <View
        style={[
          styles.fieldRow,
          multiline && styles.fieldMultiline,
          focused && styles.fieldFocused,
          error && styles.fieldError,      
        ]}
      >
        {prefix && (
          <View style={styles.prefixBox}>
            <AppText style={styles.prefixText}>{prefix}</AppText>
          </View>
        )}

        <TextInput
          style={[styles.input, multiline && styles.inputMultiline, style]}
          placeholderTextColor={COLORS.textSecondary}
          multiline={multiline}
          secureTextEntry={password && hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          textAlign="right"
          {...props}
        />

        {password && (
          <Pressable onPress={() => setHidden(!hidden)} style={styles.icon}>
            <Ionicons
              name={hidden ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textSecondary}
            />
          </Pressable>
        )}

        {icon && !password && (
          <Ionicons
            name={icon}
            size={20}
            color={COLORS.textSecondary}
            style={styles.icon}
          />
        )}
      </View>

      {error && <AppText style={styles.errorText}>{error}</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.body,
    marginBottom: SPACING.sm,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral,
    overflow: 'hidden',
  },
  fieldMultiline: {
    height: 120,
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
  },
  fieldFocused: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  fieldError: {
    borderColor: COLORS.danger,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: SPACING.md,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
  },
  inputMultiline: {
    textAlignVertical: 'top',
  },
  icon: {
    marginHorizontal: SPACING.md,
  },
  prefixBox: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.neutral,
  },
  prefixText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: FONT_SIZES.label,
    color: COLORS.danger,
    marginTop: SPACING.xs,
  },
});