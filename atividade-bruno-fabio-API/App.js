import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import BottomNav, { BOTTOM_NAV_HEIGHT } from './components/BottomNav';
import Footer from './components/Footer';
import Header from './components/Header';
import Toast from './components/Toast';
import CategoriesScreen from './screens/CategoriesScreen';
import CategoryScreen from './screens/CategoryScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import HomeScreen from './screens/HomeScreen';
import RecipeScreen from './screens/RecipeScreen';
import SearchScreen from './screens/SearchScreen';
import { getRandomMeal } from './services/mealdb';
import { colors } from './styles/theme';
import { useFavorites } from './utils/favorites';
import { useLayout } from './utils/layout';
import { useRouter } from './utils/router';
import { setTitle, setupWeb } from './utils/web';

const SITE = 'Receita Fácil';

function titleFor(route) {
  switch (route.name) {
    case 'search':
      return `Busca: ${route.q} – ${SITE}`;
    case 'categories':
      return `Categorias – ${SITE}`;
    case 'category':
      return `${route.category} – ${SITE}`;
    case 'favorites':
      return `Favoritos – ${SITE}`;
    default:
      return `${SITE} – Buscador de receitas`;
  }
}

export default function App() {
  const { route, navigate, back } = useRouter();
  const { favorites, favoriteIds, toggleFavorite } = useFavorites();
  const { isMobile } = useLayout();
  const scrollRef = useRef(null);
  const randomBusy = useRef(false);
  const [randomLoading, setRandomLoading] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setupWeb();
  }, []);

  // Cada tela nova começa no topo; o título da receita é definido pela própria tela.
  const routeKey = JSON.stringify(route);
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    if (route.name !== 'recipe') setTitle(titleFor(route));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(''), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  const openRecipe = useCallback((id) => navigate({ name: 'recipe', id }), [navigate]);

  const openRandom = useCallback(async () => {
    if (randomBusy.current) return;
    randomBusy.current = true;
    setRandomLoading(true);
    try {
      const meal = await getRandomMeal();
      if (!meal) throw new Error('A API não retornou nenhuma receita. Tente de novo.');
      navigate({ name: 'recipe', id: meal.id });
    } catch (error) {
      setNotice(error?.message || 'Não foi possível sortear uma receita agora.');
    } finally {
      randomBusy.current = false;
      setRandomLoading(false);
    }
  }, [navigate]);

  const shared = {
    favoriteIds,
    onToggleFavorite: toggleFavorite,
    onOpenRecipe: openRecipe,
    onNavigate: navigate,
  };

  let screen;
  switch (route.name) {
    case 'search':
      screen = <SearchScreen mode={route.mode} q={route.q} {...shared} />;
      break;
    case 'categories':
      screen = <CategoriesScreen onNavigate={navigate} />;
      break;
    case 'category':
      screen = <CategoryScreen category={route.category} onBack={back} {...shared} />;
      break;
    case 'recipe':
      screen = (
        <RecipeScreen
          id={route.id}
          isFavorite={favoriteIds.has(route.id)}
          onToggleFavorite={toggleFavorite}
          onBack={back}
          onNavigate={navigate}
        />
      );
      break;
    case 'favorites':
      screen = <FavoritesScreen favorites={favorites} {...shared} />;
      break;
    default:
      screen = <HomeScreen {...shared} onRandom={openRandom} randomLoading={randomLoading} />;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        ref={scrollRef}
        stickyHeaderIndices={[0]}
        contentContainerStyle={[styles.content, isMobile && { paddingBottom: BOTTOM_NAV_HEIGHT }]}
      >
        <Header
          route={route}
          favoritesCount={favorites.length}
          onNavigate={navigate}
          onRandom={openRandom}
          randomLoading={randomLoading}
        />
        <View key={routeKey} style={styles.main}>
          {screen}
        </View>
        <Footer />
      </ScrollView>
      {isMobile ? <BottomNav route={route} favoritesCount={favorites.length} onNavigate={navigate} /> : null}
      <Toast message={notice} onDismiss={() => setNotice('')} bottom={isMobile ? BOTTOM_NAV_HEIGHT + 16 : 24} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  content: { flexGrow: 1 },
  main: { flexGrow: 1 },
});
