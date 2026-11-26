import { useEffect, useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import BackLink from '../components/BackLink';
import Button from '../components/Button';
import Container from '../components/Container';
import Photo from '../components/Photo';
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews';
import Text from '../components/Text';
import { getMeal } from '../services/mealdb';
import { colors, radius, web } from '../styles/theme';
import { areaLabel, categoryLabel } from '../utils/labels';
import { useLayout } from '../utils/layout';
import { ingredientImageUrl, splitInstructions } from '../utils/meals';
import { useAsync } from '../utils/useAsync';
import { setTitle } from '../utils/web';

const openUrl = (url) => {
  if (/^https?:\/\//i.test(url)) Linking.openURL(url).catch(() => {});
};

function Tag({ label, onPress }) {
  const content = (
    <Text variant="caption" style={styles.tagText}>
      {label}
    </Text>
  );
  if (!onPress) return <View style={styles.tag}>{content}</View>;
  return (
    <Pressable
      onPress={onPress}
      role="link"
      style={({ hovered }) => [styles.tag, hovered && { backgroundColor: '#CCDDBC' }, web({ cursor: 'pointer' })]}
    >
      {content}
    </Pressable>
  );
}

function IngredientRow({ ingredient, done, onToggle }) {
  return (
    <Pressable
      onPress={onToggle}
      role="checkbox"
      aria-checked={done}
      accessibilityState={{ checked: done }}
      style={[styles.ingredient, web({ cursor: 'pointer' })]}
    >
      <View style={[styles.check, done && styles.checkDone]}>
        {done ? <Text style={styles.checkMark}>✓</Text> : null}
      </View>
      <Photo
        uri={ingredientImageUrl(ingredient.name)}
        alt=""
        resizeMode="contain"
        fallbackLabel=""
        style={styles.ingredientImage}
      />
      <Text style={[styles.ingredientName, done && styles.struck]}>{ingredient.name}</Text>
      {ingredient.measure ? (
        <Text variant="subheading" style={[styles.measure, done && styles.struck]}>
          {ingredient.measure}
        </Text>
      ) : null}
    </Pressable>
  );
}

export default function RecipeScreen({ id, isFavorite, onToggleFavorite, onBack, onNavigate }) {
  const { isDesktop } = useLayout();
  const recipe = useAsync(() => getMeal(id), [id]);
  const meal = recipe.data;

  const [doneIngredients, setDoneIngredients] = useState({});
  const [doneSteps, setDoneSteps] = useState({});
  const steps = useMemo(() => (meal ? splitInstructions(meal.instructions) : []), [meal]);

  useEffect(() => {
    if (meal) setTitle(`${meal.name} – Receita Fácil`);
  }, [meal]);

  const toggle = (setter, key) => setter((prev) => ({ ...prev, [key]: !prev[key] }));

  if (recipe.status === 'loading') {
    return (
      <Container style={styles.page}>
        <LoadingState label="Carregando receita..." />
      </Container>
    );
  }

  if (recipe.status === 'error') {
    return (
      <Container style={styles.page}>
        <BackLink onPress={onBack} />
        <View style={styles.spaced}>
          <ErrorState message={recipe.error?.message} onRetry={recipe.reload} />
        </View>
      </Container>
    );
  }

  if (!meal) {
    return (
      <Container style={styles.page}>
        <BackLink onPress={onBack} />
        <EmptyState
          title="Receita não encontrada"
          message="Essa receita não existe mais ou o link está incorreto."
          actions={<Button label="Ir para o início" onPress={() => onNavigate({ name: 'home' })} />}
        />
      </Container>
    );
  }

  const checkedCount = meal.ingredients.filter((_, i) => doneIngredients[i]).length;
  const area = areaLabel(meal.area);

  return (
    <Container style={styles.page}>
      <BackLink onPress={onBack} />

      <View style={[styles.top, isDesktop && styles.topDesktop]}>
        <Photo
          uri={meal.thumb}
          alt={meal.name}
          style={[styles.photo, isDesktop ? { width: 460, height: 460 } : { width: '100%', aspectRatio: 1 }]}
        />

        <View style={[styles.summary, isDesktop ? { flex: 1 } : { width: '100%' }]}>
          <View style={styles.tags}>
            {meal.category ? (
              <Tag
                label={categoryLabel(meal.category)}
                onPress={() => onNavigate({ name: 'category', category: meal.category })}
              />
            ) : null}
            {area ? <Tag label={`Cozinha ${area.toLowerCase()}`} /> : null}
            {meal.tags.slice(0, 3).map((t) => (
              <Tag key={t} label={t} />
            ))}
          </View>

          <Text variant="display" role="heading" aria-level={1} style={isDesktop ? styles.titleDesktop : styles.titleMobile}>
            {meal.name}
          </Text>

          <View style={styles.actions}>
            <Button
              label={isFavorite ? 'Salvo nos favoritos' : 'Salvar nos favoritos'}
              variant={isFavorite ? 'soft' : 'primary'}
              onPress={() => onToggleFavorite(meal)}
            />
            {meal.youtube ? <Button label="Assistir ao vídeo" variant="outline" onPress={() => openUrl(meal.youtube)} /> : null}
            {meal.source ? <Button label="Receita original" variant="outline" onPress={() => openUrl(meal.source)} /> : null}
          </View>
        </View>
      </View>

      <View style={[styles.body, isDesktop && styles.bodyDesktop]}>
        <View style={[styles.panel, isDesktop ? { width: 400 } : { width: '100%' }]}>
          <Text variant="title" role="heading" aria-level={2} style={styles.sectionTitle}>
            Ingredientes
          </Text>
          {meal.ingredients.length > 0 ? (
            <>
              <Text variant="small" style={styles.hint}>
                Toque para marcar o que já separou ({checkedCount} de {meal.ingredients.length}).
              </Text>
              <View>
                {meal.ingredients.map((ingredient, i) => (
                  <IngredientRow
                    key={`${ingredient.name}-${i}`}
                    ingredient={ingredient}
                    done={!!doneIngredients[i]}
                    onToggle={() => toggle(setDoneIngredients, i)}
                  />
                ))}
              </View>
            </>
          ) : (
            <Text variant="small">Esta receita não lista ingredientes.</Text>
          )}
        </View>

        <View style={isDesktop ? { flex: 1 } : { width: '100%' }}>
          <Text variant="title" role="heading" aria-level={2} style={styles.sectionTitle}>
            Modo de preparo
          </Text>
          {steps.length > 0 ? (
            <>
              <Text variant="small" style={styles.hint}>
                Toque em um passo para marcá-lo como feito.
              </Text>
              <View style={styles.steps}>
                {steps.map((step, i) => {
                  const done = !!doneSteps[i];
                  return (
                    <Pressable
                      key={i}
                      onPress={() => toggle(setDoneSteps, i)}
                      role="checkbox"
                      aria-checked={done}
                      accessibilityState={{ checked: done }}
                      style={[styles.step, web({ cursor: 'pointer' })]}
                    >
                      <View style={[styles.stepNumber, done && styles.stepNumberDone]}>
                        <Text variant="subheading" style={{ color: done ? colors.paper : colors.forest, fontSize: 15 }}>
                          {i + 1}
                        </Text>
                      </View>
                      <Text style={[styles.stepText, done && styles.stepTextDone]}>{step}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : (
            <Text variant="small">Esta receita não traz o modo de preparo.</Text>
          )}
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  page: { paddingTop: 28, paddingBottom: 24 },
  spaced: { marginTop: 20 },
  top: { marginTop: 20, gap: 28 },
  topDesktop: { flexDirection: 'row', alignItems: 'center', gap: 56 },
  photo: { borderRadius: 32 },
  summary: { gap: 20 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: colors.sage },
  tagText: { color: colors.forest, fontSize: 13 },
  titleDesktop: { fontSize: 48, lineHeight: 54 },
  titleMobile: { fontSize: 34, lineHeight: 40 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  body: { marginTop: 48, gap: 40 },
  bodyDesktop: { flexDirection: 'row', alignItems: 'flex-start', gap: 56 },
  panel: { backgroundColor: colors.sageLight, borderRadius: radius.lg, padding: 24 },
  sectionTitle: { fontSize: 28, lineHeight: 34 },
  hint: { marginTop: 6, marginBottom: 14 },

  ingredient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.sage,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: colors.forest },
  checkMark: { color: colors.paper, fontSize: 13, lineHeight: 16, fontWeight: '700' },
  ingredientImage: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.paper },
  ingredientName: { flex: 1, minWidth: 0 },
  measure: { fontSize: 15, textAlign: 'right', maxWidth: 140 },
  struck: { textDecorationLine: 'line-through', color: colors.muted },

  steps: { gap: 8 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, paddingVertical: 10 },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberDone: { backgroundColor: colors.forest },
  stepText: { flex: 1, minWidth: 0, fontSize: 17, lineHeight: 29 },
  stepTextDone: { color: colors.muted },
});
