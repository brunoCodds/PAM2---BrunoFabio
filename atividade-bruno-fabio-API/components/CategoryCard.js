import { Pressable, StyleSheet } from 'react-native';
import Photo from './Photo';
import Text from './Text';
import { categoryLabel } from '../utils/labels';
import { colors, radius, web } from '../styles/theme';

/** Card grande de categoria para a página "Categorias". */
export default function CategoryCard({ category, width, onPress }) {
  return (
    <Pressable
      onPress={() => onPress(category.name)}
      role="link"
      aria-label={`Ver receitas da categoria ${categoryLabel(category.name)}`}
      style={({ hovered, pressed }) => [
        styles.card,
        { width },
        (hovered || pressed) && { backgroundColor: colors.sage },
        web({ cursor: 'pointer', transitionProperty: 'background-color', transitionDuration: '150ms' }),
      ]}
    >
      <Photo uri={category.thumb} alt="" resizeMode="contain" fallbackLabel="" style={styles.photo} />
      <Text variant="heading" style={styles.label}>
        {categoryLabel(category.name)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.sageLight,
    borderRadius: radius.lg,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  photo: { width: '100%', height: 120, backgroundColor: 'transparent' },
  label: { fontSize: 20, lineHeight: 26, textAlign: 'center' },
});
