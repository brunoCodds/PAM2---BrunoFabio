import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, space } from '../theme';

export default function Banner({ message, type = 'error' }) {
  if (!message) return null;
  const isError = type === 'error';

  return (
    <View
      accessibilityRole={isError ? 'alert' : undefined}
      style={[styles.box, isError ? styles.error : styles.info]}
    >
      <Text style={[styles.text, { color: isError ? colors.danger : colors.primary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: space.md, borderRadius: radius.md, borderWidth: 1 },
  error: { backgroundColor: colors.dangerSoft, borderColor: '#F2B8B2' },
  info: { backgroundColor: colors.primarySoft, borderColor: '#B7D9D5' },
  text: { fontSize: 14, lineHeight: 20 },
});
