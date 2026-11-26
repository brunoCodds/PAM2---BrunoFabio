import { Pressable, StyleSheet, View } from 'react-native';
import FavoriteButton from './FavoriteButton';
import Photo from './Photo';
import Text from './Text';
import { categoryLabel } from '../utils/labels';
import { radius, web } from '../styles/theme';

/** Card de receita: foto grande, nome, categoria (quando existe) e favoritar. */
export default function RecipeCard({ meal, width, isFavorite, onToggleFavorite, onOpen }) {
  const compact = width < 200;

  return (
    <View style={{ width }}>
      <Pressable
        onPress={() => onOpen(meal.id)}
        role="link"
        aria-label={`Abrir receita ${meal.name}`}
        style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, web({ cursor: 'pointer' })]}
      >
        {({ hovered }) => (
          <>
            <Photo uri={meal.thumb} alt={meal.name} style={{ width, height: width, borderRadius: radius.lg }} />
            <Text
              variant="subheading"
              numberOfLines={2}
              style={[
                styles.name,
                compact && { fontSize: 15, lineHeight: 21 },
                hovered && { textDecorationLine: 'underline' },
              ]}
            >
              {meal.name}
            </Text>
            {meal.category ? <Text variant="small">{categoryLabel(meal.category)}</Text> : null}
          </>
        )}
      </Pressable>
      <View style={styles.favorite}>
        <FavoriteButton active={isFavorite} name={meal.name} onPress={() => onToggleFavorite(meal)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  name: { marginTop: 12, marginBottom: 2 },
  favorite: { position: 'absolute', top: 10, right: 10 },
});
