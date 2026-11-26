import { Pressable, StyleSheet, View } from 'react-native';
import Photo from './Photo';
import { colors, web } from '../styles/theme';

// Três molduras em arco, em alturas diferentes, com fotos de receitas reais.
const ARCHES = [
  { width: 150, height: 250, top: 56 },
  { width: 172, height: 320, top: 0 },
  { width: 150, height: 218, top: 102 },
];

/** `meals` pode ser null enquanto carrega: mostra os arcos vazios como reserva de espaço. */
export default function HeroCollage({ meals, onOpenRecipe }) {
  return (
    <View style={styles.row} accessibilityElementsHidden={!meals} importantForAccessibility={meals ? 'auto' : 'no-hide-descendants'}>
      {ARCHES.map((arch, i) => {
        const meal = meals ? meals[i] : null;
        const shape = {
          width: arch.width,
          height: arch.height,
          borderTopLeftRadius: arch.width / 2,
          borderTopRightRadius: arch.width / 2,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          backgroundColor: colors.sage,
        };
        return (
          <View key={i} style={{ marginTop: arch.top }}>
            {meal ? (
              <Pressable
                onPress={() => onOpenRecipe(meal.id)}
                role="link"
                aria-label={`Abrir receita ${meal.name}`}
                style={({ hovered }) => [{ opacity: hovered ? 0.92 : 1 }, web({ cursor: 'pointer' })]}
              >
                <Photo uri={meal.thumb} alt={meal.name} fallbackLabel="" style={shape} />
              </Pressable>
            ) : (
              <View style={[shape, { backgroundColor: colors.sage, opacity: 0.6 }]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
});
