import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, focusRing, radius, space } from '../theme';

const VARIANTS = {
  primary: { bg: colors.primary, hover: colors.primaryHover, text: colors.white, border: colors.primary },
  danger: { bg: colors.danger, hover: colors.dangerHover, text: colors.white, border: colors.danger },
  secondary: { bg: colors.surface, hover: colors.background, text: colors.text, border: colors.border },
  ghost: { bg: 'transparent', hover: colors.primarySoft, text: colors.primary, border: 'transparent' },
  dangerGhost: { bg: 'transparent', hover: colors.dangerSoft, text: colors.danger, border: 'transparent' },
};

export default function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, small = false, style }) {
  const look = VARIANTS[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed, hovered, focused }) => [
        styles.base,
        small && styles.small,
        { backgroundColor: hovered || pressed ? look.hover : look.bg, borderColor: look.border },
        focused && styles.focused,
        inactive && styles.inactive,
        style,
      ]}
    >
      {loading ? <ActivityIndicator size="small" color={look.text} /> : null}
      <Text style={[styles.label, small && styles.labelSmall, { color: look.text }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    paddingHorizontal: space.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  small: { minHeight: 36, paddingHorizontal: space.md, borderRadius: radius.sm },
  label: { fontSize: 15, fontWeight: '600' },
  labelSmall: { fontSize: 14 },
  focused: { boxShadow: focusRing },
  inactive: { opacity: 0.55 },
});
