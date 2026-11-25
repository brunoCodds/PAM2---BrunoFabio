import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, space } from '../theme';

export default function Loading({ label = 'Carregando…', fullScreen = false }) {
  return (
    <View style={[styles.box, fullScreen && styles.fullScreen]} accessibilityLiveRegion="polite">
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', gap: space.sm, paddingVertical: space.xxl },
  fullScreen: { flex: 1, justifyContent: 'center', backgroundColor: colors.background },
  label: { color: colors.muted, fontSize: 14 },
});
