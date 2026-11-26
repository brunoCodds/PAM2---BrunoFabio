const clean = (value) => (typeof value === 'string' ? value.trim() : '');

/**
 * Converte o objeto bruto da TheMealDB para o formato usado no app.
 * Campos ausentes viram string vazia / lista vazia. Retorna null se não
 * houver id (resposta inválida).
 */
export function normalizeMeal(raw, extra = {}) {
  if (!raw || !raw.idMeal) return null;

  const ingredients = [];
  for (let i = 1; i <= 20; i += 1) {
    const name = clean(raw[`strIngredient${i}`]);
    if (!name) continue;
    ingredients.push({ name, measure: clean(raw[`strMeasure${i}`]) });
  }

  return {
    id: String(raw.idMeal),
    name: clean(raw.strMeal) || 'Receita sem nome',
    thumb: clean(raw.strMealThumb),
    category: clean(raw.strCategory) || extra.category || '',
    area: clean(raw.strArea),
    instructions: clean(raw.strInstructions),
    tags: clean(raw.strTags)
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    youtube: clean(raw.strYoutube),
    source: clean(raw.strSource),
    ingredients,
  };
}

export function normalizeCategory(raw) {
  if (!raw || !raw.strCategory) return null;
  return {
    id: String(raw.idCategory || raw.strCategory),
    name: clean(raw.strCategory),
    thumb: clean(raw.strCategoryThumb),
    description: clean(raw.strCategoryDescription),
  };
}

/**
 * Divide o modo de preparo em passos. A API costuma enviar um texto com
 * quebras de linha, às vezes com linhas "STEP 1" ou numeração própria.
 */
export function splitInstructions(text) {
  if (!text) return [];

  let lines = text
    .split(/\r?\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/^(step|passo)?\s*\d+\s*[.):]?$/i.test(l))
    .map((l) =>
      l
        .replace(/^(step|passo)\s*\d+\s*[.:)-]?\s*/i, '')
        .replace(/^\d+\s*[.)]\s+/, '')
        .trim()
    )
    .filter(Boolean);

  // Texto corrido, sem quebras: separa por frases, juntando as muito curtas.
  if (lines.length === 1 && lines[0].length > 280) {
    const sentences = lines[0].match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [lines[0]];
    const steps = [];
    let buffer = '';
    sentences.forEach((s) => {
      buffer = `${buffer} ${s}`.trim();
      if (buffer.length >= 70) {
        steps.push(buffer);
        buffer = '';
      }
    });
    if (buffer) steps.push(buffer);
    lines = steps;
  }

  return lines;
}

export const ingredientImageUrl = (name) =>
  `https://www.themealdb.com/images/ingredients/${encodeURIComponent(name)}-Small.png`;
