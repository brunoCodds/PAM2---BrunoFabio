import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../components/Button';
import CategoryChip from '../components/CategoryChip';
import Container from '../components/Container';
import HeroCollage from '../components/HeroCollage';
import RecipeGrid from '../components/RecipeGrid';
import SearchBar from '../components/SearchBar';
import SectionHeader from '../components/SectionHeader';
import { ErrorState, LoadingState } from '../components/StateViews';
import Text from '../components/Text';
import { getCategories, getMealsByCategory } from '../services/mealdb';
import { colors, radius } from '../styles/theme';
import { categoryLabel } from '../utils/labels';
import { useLayout } from '../utils/layout';
import { useAsync } from '../utils/useAsync';

// A API não tem "mais populares": as sugestões vêm de uma categoria que muda a cada dia.
const SUGGESTION_CATEGORIES = ['Chicken', 'Dessert', 'Beef', 'Seafood', 'Vegetarian', 'Pork', 'Side', 'Miscellaneous'];

function categoryOfTheDay() {
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  return SUGGESTION_CATEGORIES[dayOfYear % SUGGESTION_CATEGORIES.length];
}

export default function HomeScreen({ favoriteIds, onToggleFavorite, onOpenRecipe, onNavigate, onRandom, randomLoading }) {
  const { isMobile, isDesktop } = useLayout();
  const todayCategory = useMemo(categoryOfTheDay, []);

  const categories = useAsync(getCategories, []);
  const suggestions = useAsync(() => getMealsByCategory(todayCategory), [todayCategory]);

  const collageMeals = suggestions.status === 'success' && suggestions.data.length >= 3 ? suggestions.data.slice(0, 3) : null;
  const showCollage = isDesktop && suggestions.status !== 'error';
  // A colagem já usa as 3 primeiras; se sobrarem poucas, o grid mostra todas para não ficar vazio.
  const allSuggestions = suggestions.status === 'success' ? suggestions.data : [];
  const afterCollage = showCollage && collageMeals ? allSuggestions.slice(3, 11) : [];
  const gridMeals = afterCollage.length >= 4 ? afterCollage : allSuggestions.slice(0, 8);

  return (
    <View>
      <Container style={styles.heroWrap}>
        <View style={[styles.hero, isMobile && styles.heroMobile]}>
          <View style={styles.heroText}>
            <Text variant="display" role="heading" aria-level={1} style={isMobile && styles.displayMobile}>
              O que vamos cozinhar hoje?
            </Text>
            <Text style={styles.lead}>
              Pesquise por receita ou ingrediente e siga o modo de preparo passo a passo.
            </Text>
            <SearchBar
              showExamples
              onSubmit={(mode, q) => onNavigate({ name: 'search', mode, q })}
            />
            <View style={styles.surprise}>
              <Text variant="small">Sem ideias?</Text>
              <Button label="Receita surpresa" variant="accent" size="sm" loading={randomLoading} onPress={onRandom} />
            </View>
          </View>
          {showCollage ? <HeroCollage meals={collageMeals} onOpenRecipe={onOpenRecipe} /> : null}
        </View>
      </Container>

      <Container style={styles.section}>
        <SectionHeader
          title="Categorias"
          subtitle="Escolha um tipo de prato"
          actionLabel="Ver todas"
          onAction={() => onNavigate({ name: 'categories' })}
        />
        {categories.status === 'loading' ? <LoadingState label="Carregando categorias..." /> : null}
        {categories.status === 'error' ? (
          <ErrorState message={categories.error?.message} onRetry={categories.reload} />
        ) : null}
        {categories.status === 'success' ? (
          <View style={styles.chips}>
            {categories.data.map((category) => (
              <CategoryChip
                key={category.id}
                category={category}
                onPress={(name) => onNavigate({ name: 'category', category: name })}
              />
            ))}
          </View>
        ) : null}
      </Container>

      <Container style={styles.section}>
        <SectionHeader
          title="Sugestões de hoje"
          subtitle={`Receitas de ${categoryLabel(todayCategory).toLowerCase()} para começar`}
          actionLabel="Ver a categoria"
          onAction={() => onNavigate({ name: 'category', category: todayCategory })}
        />
        {suggestions.status === 'loading' ? <LoadingState label="Buscando sugestões..." /> : null}
        {suggestions.status === 'error' ? (
          <ErrorState message={suggestions.error?.message} onRetry={suggestions.reload} />
        ) : null}
        {suggestions.status === 'success' && gridMeals.length > 0 ? (
          <RecipeGrid
            meals={gridMeals}
            favoriteIds={favoriteIds}
            onToggleFavorite={onToggleFavorite}
            onOpenRecipe={onOpenRecipe}
          />
        ) : null}
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrap: { paddingTop: 28 },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 40,
    backgroundColor: colors.sageLight,
    borderRadius: 36,
    paddingVertical: 48,
    paddingHorizontal: 56,
    overflow: 'hidden',
  },
  heroMobile: { paddingVertical: 28, paddingHorizontal: 20, borderRadius: radius.lg },
  heroText: { flex: 1, gap: 20, maxWidth: 560, minWidth: 0 },
  displayMobile: { fontSize: 36, lineHeight: 42 },
  lead: { fontSize: 18, lineHeight: 28, color: colors.muted, maxWidth: 480 },
  surprise: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  section: { paddingTop: 56 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});
