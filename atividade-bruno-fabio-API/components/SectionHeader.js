import { Pressable, StyleSheet, View } from 'react-native';
import Text from './Text';
import { colors, web } from '../styles/theme';

export default function SectionHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <Text variant="title" role="heading" aria-level={2} style={styles.title}>
          {title}
        </Text>
        {subtitle ? <Text variant="small">{subtitle}</Text> : null}
      </View>
      {actionLabel ? (
        <Pressable onPress={onAction} role="link" style={web({ cursor: 'pointer' })}>
          {({ hovered }) => (
            <Text
              variant="subheading"
              style={[styles.action, hovered && { textDecorationLine: 'underline' }]}
            >
              {actionLabel}
            </Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 20 },
  texts: { flexShrink: 1, gap: 2 },
  title: { fontSize: 30, lineHeight: 36 },
  action: { color: colors.forest, fontSize: 15 },
});
