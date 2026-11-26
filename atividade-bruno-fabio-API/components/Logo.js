import { Pressable, StyleSheet, View } from 'react-native';
import Text from './Text';
import { colors, web } from '../styles/theme';

export default function Logo({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      role="link"
      aria-label="Receita Fácil, ir para o início"
      style={[styles.row, web({ cursor: 'pointer' })]}
    >
      <View style={styles.mark}>
        <View style={styles.leaf} />
        <View style={styles.dot} />
      </View>
      <Text variant="heading" style={styles.name}>
        Receita Fácil
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaf: {
    width: 16,
    height: 16,
    backgroundColor: colors.sage,
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.orange,
  },
  name: { fontSize: 22, lineHeight: 28 },
});
