import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, space } from '../theme';

export default function EmptyState({ title, text, children }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      {text ? <Text style={styles.text}>{text}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    gap: space.sm,
    padding: space.xxl,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  title: { fontSize: 17, fontWeight: '600', color: colors.text, textAlign: 'center' },
  text: { fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 20, maxWidth: 360 },
});
