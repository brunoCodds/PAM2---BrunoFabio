import Grid from './Grid';
import RecipeCard from './RecipeCard';
import { useLayout } from '../utils/layout';

export default function RecipeGrid({ meals, favoriteIds, onToggleFavorite, onOpenRecipe }) {
  const { isMobile } = useLayout();
  return (
    <Grid
      data={meals}
      minWidth={isMobile ? 150 : 240}
      keyExtractor={(meal) => meal.id}
      renderItem={(meal, width) => (
        <RecipeCard
          meal={meal}
          width={width}
          isFavorite={favoriteIds.has(meal.id)}
          onToggleFavorite={onToggleFavorite}
          onOpen={onOpenRecipe}
        />
      )}
    />
  );
}
