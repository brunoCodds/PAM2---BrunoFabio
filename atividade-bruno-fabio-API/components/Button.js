import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import Text from './Text';
import { colors, radius, web } from '../styles/theme';

const VARIANTS = {
  primary: { bg: colors.forest, hover: colors.forestDark, fg: colors.paper, border: colors.forest },
  accent: { bg: colors.orange, hover: '#D97A22', fg: colors.forestDark, border: colors.orange },
  soft: { bg: colors.sage, hover: '#CCDDBC', fg: colors.forest, border: colors.sage },
  outline: { bg: 'transparent', hover: colors.sageLight, fg: colors.forest, border: colors.forest },
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}) {
  const v = VARIANTS[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      role="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed, hovered }) => [
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: hovered || pressed ? v.hover : v.bg, borderColor: v.border },
        inactive && styles.inactive,
        web({ cursor: inactive ? 'default' : 'pointer', transitionProperty: 'background-color', transitionDuration: '150ms' }),
        style,
      ]}
    >
      {loading ? <ActivityIndicator size="small" color={v.fg} style={styles.spinner} /> : null}
      <Text variant="subheading" style={{ color: v.fg, fontSize: size === 'sm' ? 14 : 16 }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: radius.pill,
  },
  md: { paddingVertical: 13, paddingHorizontal: 24 },
  sm: { paddingVertical: 9, paddingHorizontal: 16 },
  inactive: { opacity: 0.65 },
  spinner: { marginRight: 8 },
});
