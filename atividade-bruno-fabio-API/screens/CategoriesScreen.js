import { StyleSheet, View } from 'react-native';
import CategoryCard from '../components/CategoryCard';
import Container from '../components/Container';
import Grid from '../components/Grid';
import { ErrorState, LoadingState } from '../components/StateViews';
import Text from '../components/Text';
import { getCategories } from '../services/mealdb';
import { useLayout } from '../utils/layout';
import { useAsync } from '../utils/useAsync';

export default function CategoriesScreen({ onNavigate }) {
  const { isMobile } = useLayout();
  const categories = useAsync(getCategories, []);

  return (
    <Container style={styles.page}>
      <Text variant="title" role="heading" aria-level={1}>
        Categorias
      </Text>
      <Text style={styles.lead}>Escolha um tipo de prato para ver as receitas.</Text>

      <View style={styles.body}>
        {categories.status === 'loading' ? <LoadingState label="Carregando categorias..." /> : null}
        {categories.status === 'error' ? (
          <ErrorState message={categories.error?.message} onRetry={categories.reload} />
        ) : null}
        {categories.status === 'success' ? (
          <Grid
            data={categories.data}
            minWidth={isMobile ? 150 : 200}
            keyExtractor={(c) => c.id}
            renderItem={(category, width) => (
              <CategoryCard
                category={category}
                width={width}
                onPress={(name) => onNavigate({ name: 'category', category: name })}
              />
            )}
          />
        ) : null}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  page: { paddingTop: 36, paddingBottom: 24 },
  lead: { marginTop: 8, color: '#5F7066' },
  body: { marginTop: 28 },
});
