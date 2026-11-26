import { Pressable, StyleSheet } from 'react-native';
import Photo from './Photo';
import Text from './Text';
import { categoryLabel } from '../utils/labels';
import { colors, radius, web } from '../styles/theme';

/** Atalho compacto de categoria (foto redonda + nome). */
export default function CategoryChip({ category, onPress }) {
  return (
    <Pressable
      onPress={() => onPress(category.name)}
      role="link"
      aria-label={`Ver receitas da categoria ${categoryLabel(category.name)}`}
      style={({ hovered, pressed }) => [
        styles.chip,
        (hovered || pressed) && { backgroundColor: colors.sage },
        web({ cursor: 'pointer', transitionProperty: 'background-color', transitionDuration: '150ms' }),
      ]}
    >
      <Photo uri={category.thumb} alt="" resizeMode="contain" fallbackLabel="" style={styles.photo} />
      <Text variant="subheading" style={styles.label}>
        {categoryLabel(category.name)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
  },
  photo: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.sage },
  label: { fontSize: 15 },
});
