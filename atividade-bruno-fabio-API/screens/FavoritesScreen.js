import { StyleSheet, View } from 'react-native';
import Button from '../components/Button';
import Container from '../components/Container';
import RecipeGrid from '../components/RecipeGrid';
import { EmptyState } from '../components/StateViews';
import Text from '../components/Text';

export default function FavoritesScreen({ favorites, favoriteIds, onToggleFavorite, onOpenRecipe, onNavigate }) {
  return (
    <Container style={styles.page}>
      <Text variant="title" role="heading" aria-level={1}>
        Favoritos
      </Text>
      <Text style={styles.lead}>
        {favorites.length === 0
          ? 'As receitas que você salvar ficam aqui, mesmo depois de fechar o navegador.'
          : favorites.length === 1
            ? '1 receita salva neste navegador.'
            : `${favorites.length} receitas salvas neste navegador.`}
      </Text>

      <View style={styles.body}>
        {favorites.length === 0 ? (
          <EmptyState
            title="Você ainda não salvou nenhuma receita"
            message="Toque no coração de uma receita para guardá-la aqui."
            actions={
              <>
                <Button label="Buscar receitas" onPress={() => onNavigate({ name: 'home' })} />
                <Button label="Ver categorias" variant="outline" onPress={() => onNavigate({ name: 'categories' })} />
              </>
            }
          />
        ) : (
          <RecipeGrid
            meals={favorites}
            favoriteIds={favoriteIds}
            onToggleFavorite={onToggleFavorite}
            onOpenRecipe={onOpenRecipe}
          />
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  page: { paddingTop: 36, paddingBottom: 24 },
  lead: { marginTop: 8, color: '#5F7066' },
  body: { marginTop: 28 },
});
