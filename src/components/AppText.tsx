import { Text, TextProps, StyleSheet } from 'react-native';
import { FONTS, COLORS } from '../constants/theme';

export default function AppText({ style, ...props }: TextProps) {
  return <Text style={[styles.base, style]} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    fontFamily: FONTS.regular,
    color: COLORS.text,
    textAlign: 'right',
  },
});