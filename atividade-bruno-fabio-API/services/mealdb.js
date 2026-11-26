import { normalizeCategory, normalizeMeal } from '../utils/meals';
import { buildQueries } from '../utils/translate';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

export class ApiError extends Error {
  constructor(message, kind) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
  }
}

// Cache em memória (guarda a Promise, então chamadas simultâneas iguais
// compartilham a mesma requisição). Falhas nunca ficam em cache.
const cache = new Map();

async function fetchJson(path) {
  let response;
  try {
    response = await fetch(BASE_URL + path);
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor de receitas. Verifique sua internet e tente de novo.',
      'network'
    );
  }

  if (!response.ok) {
    throw new ApiError(
      `O servidor de receitas respondeu com erro (${response.status}). Tente novamente em instantes.`,
      'http'
    );
  }

  // A API às vezes devolve corpo vazio quando não há resultados.
  const text = await response.text();
  if (!text.trim()) return { meals: null };

  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError('O servidor de receitas enviou uma resposta inválida.', 'parse');
  }
}

function request(path, { useCache = true } = {}) {
  if (!useCache) return fetchJson(path);
  if (!cache.has(path)) {
    const promise = fetchJson(path);
    cache.set(path, promise);
    promise.catch(() => cache.delete(path));
  }
  return cache.get(path);
}

const lookupKey = (id) => `lookup.php?i=${encodeURIComponent(id)}`;

// Respostas completas (busca por nome, aleatória) já trazem os detalhes:
// guardamos para abrir a receita sem outra requisição.
function primeLookup(rawMeal) {
  if (!rawMeal || !rawMeal.idMeal) return;
  const key = lookupKey(rawMeal.idMeal);
  if (!cache.has(key)) cache.set(key, Promise.resolve({ meals: [rawMeal] }));
}

const mealsOf = (data) => (data && Array.isArray(data.meals) ? data.meals : []);

const toMeals = (data, extra) =>
  mealsOf(data)
    .map((raw) => normalizeMeal(raw, extra))
    .filter(Boolean);

export async function searchByName(term) {
  const data = await request(`search.php?s=${encodeURIComponent(term)}`);
  mealsOf(data).forEach(primeLookup);
  return toMeals(data);
}

export async function searchByIngredient(term) {
  const data = await request(`filter.php?i=${encodeURIComponent(term)}`);
  return toMeals(data);
}

/**
 * Busca por nome ou ingrediente aceitando português: tenta os termos
 * traduzidos em ordem e devolve o primeiro com resultados.
 * Retorna { meals, usedQuery }.
 */
export async function searchRecipes(mode, text) {
  const candidates = buildQueries(text, mode);
  const search = mode === 'ingredient' ? searchByIngredient : searchByName;
  for (const candidate of candidates) {
    const meals = await search(candidate);
    if (meals.length > 0) return { meals, usedQuery: candidate };
  }
  return { meals: [], usedQuery: candidates[0] || '' };
}

export async function getCategories() {
  const data = await request('categories.php');
  const list = data && Array.isArray(data.categories) ? data.categories : [];
  return list.map(normalizeCategory).filter(Boolean);
}

export async function getMealsByCategory(category) {
  const data = await request(`filter.php?c=${encodeURIComponent(category)}`);
  return toMeals(data, { category });
}

/** Detalhes completos de uma receita; null se o id não existir. */
export async function getMeal(id) {
  const data = await request(lookupKey(id));
  return normalizeMeal(mealsOf(data)[0]);
}

/** Receita aleatória (nunca vem do cache). */
export async function getRandomMeal() {
  const data = await request('random.php', { useCache: false });
  const raw = mealsOf(data)[0];
  primeLookup(raw);
  return normalizeMeal(raw);
}
