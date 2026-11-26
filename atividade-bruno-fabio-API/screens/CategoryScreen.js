import { StyleSheet, View } from 'react-native';
import Container from '../components/Container';
import RecipeGrid from '../components/RecipeGrid';
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews';
import Text from '../components/Text';
import BackLink from '../components/BackLink';
import { getCategories, getMealsByCategory } from '../services/mealdb';
import { categoryLabel } from '../utils/labels';
import { useAsync } from '../utils/useAsync';

export default function CategoryScreen({ category, favoriteIds, onToggleFavorite, onOpenRecipe, onBack }) {
  const meals = useAsync(() => getMealsByCategory(category), [category]);
  // A descrição é opcional: se a lista de categorias falhar, a tela segue funcionando.
  const categories = useAsync(getCategories, []);
  const info = categories.status === 'success' ? categories.data.find((c) => c.name === category) : null;

  return (
    <Container style={styles.page}>
      <BackLink onPress={onBack} label="Voltar" />
      <Text variant="title" role="heading" aria-level={1} style={styles.title}>
        {categoryLabel(category)}
      </Text>
      {info && info.description ? (
        <Text style={styles.description} numberOfLines={4}>
          {info.description}
        </Text>
      ) : null}

      <View style={styles.body}>
        {meals.status === 'loading' ? <LoadingState label="Buscando receitas..." /> : null}
        {meals.status === 'error' ? <ErrorState message={meals.error?.message} onRetry={meals.reload} /> : null}
        {meals.status === 'success' && meals.data.length === 0 ? (
          <EmptyState title="Nenhuma receita nesta categoria" message="Volte e escolha outra categoria." />
        ) : null}
        {meals.status === 'success' && meals.data.length > 0 ? (
          <>
            <Text variant="subheading" style={styles.count} role="status">
              {meals.data.length === 1 ? '1 receita' : `${meals.data.length} receitas`}
            </Text>
            <RecipeGrid
              meals={meals.data}
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
              onOpenRecipe={onOpenRecipe}
            />
          </>
        ) : null}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  page: { paddingTop: 28, paddingBottom: 24 },
  title: { marginTop: 16 },
  description: { marginTop: 10, maxWidth: 720, color: '#5F7066' },
  body: { marginTop: 28 },
  count: { marginBottom: 20 },
});
