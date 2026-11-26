import { StyleSheet, View } from 'react-native';
import Button from '../components/Button';
import Container from '../components/Container';
import RecipeGrid from '../components/RecipeGrid';
import SearchBar from '../components/SearchBar';
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews';
import Text from '../components/Text';
import { searchRecipes } from '../services/mealdb';
import { useAsync } from '../utils/useAsync';

export default function SearchScreen({ mode, q, favoriteIds, onToggleFavorite, onOpenRecipe, onNavigate }) {
  const hasQuery = q.trim().length > 0;
  const search = useAsync(() => (hasQuery ? searchRecipes(mode, q) : Promise.resolve(null)), [mode, q]);

  const otherMode = mode === 'name' ? 'ingredient' : 'name';
  const results = search.data;
  const total = results ? results.meals.length : 0;
  const translated =
    results && results.usedQuery && results.usedQuery.replace(/_/g, ' ').toLowerCase() !== q.trim().toLowerCase();

  return (
    <Container style={styles.page}>
      <Text variant="title" role="heading" aria-level={1}>
        Resultados da busca
      </Text>
      <View style={styles.bar}>
        <SearchBar
          initialMode={mode}
          initialQuery={q}
          onSubmit={(nextMode, nextQ) => onNavigate({ name: 'search', mode: nextMode, q: nextQ })}
        />
      </View>

      {!hasQuery ? (
        <EmptyState title="O que você quer cozinhar?" message="Digite o nome de uma receita ou de um ingrediente para começar." />
      ) : null}

      {hasQuery && search.status === 'loading' ? <LoadingState label="Buscando receitas..." /> : null}

      {hasQuery && search.status === 'error' ? (
        <ErrorState message={search.error?.message} onRetry={search.reload} />
      ) : null}

      {hasQuery && search.status === 'success' && total === 0 ? (
        <EmptyState
          title={`Nenhuma receita para “${q}”`}
          message={
            mode === 'name'
              ? 'Confira a escrita ou tente um termo mais simples, como “frango”. Você também pode buscar pelo ingrediente.'
              : 'Tente outro ingrediente, no singular, como “batata”. Você também pode buscar pelo nome da receita.'
          }
          actions={
            <>
              <Button
                label={otherMode === 'name' ? 'Buscar pelo nome' : 'Buscar por ingrediente'}
                variant="primary"
                onPress={() => onNavigate({ name: 'search', mode: otherMode, q })}
              />
              <Button label="Ver categorias" variant="outline" onPress={() => onNavigate({ name: 'categories' })} />
            </>
          }
        />
      ) : null}

      {hasQuery && search.status === 'success' && total > 0 ? (
        <View style={styles.results}>
          <Text variant="subheading" role="status">
            {total === 1 ? '1 receita encontrada' : `${total} receitas encontradas`} para “{q}”
          </Text>
          {translated ? (
            <Text variant="small" style={styles.note}>
              O catálogo está em inglês, então a busca usou “{results.usedQuery.replace(/_/g, ' ')}”.
            </Text>
          ) : null}
          <View style={styles.grid}>
            <RecipeGrid
              meals={results.meals}
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
              onOpenRecipe={onOpenRecipe}
            />
          </View>
        </View>
      ) : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  page: { paddingTop: 36, paddingBottom: 24 },
  bar: { marginTop: 20, maxWidth: 720 },
  results: { marginTop: 36, gap: 4 },
  note: { marginTop: 2 },
  grid: { marginTop: 20 },
});
