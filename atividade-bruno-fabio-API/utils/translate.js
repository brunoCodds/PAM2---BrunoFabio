// A TheMealDB só entende termos em inglês. Este módulo converte o que o
// usuário digita em português nos termos que a API conhece. Termos
// desconhecidos são enviados do jeito que foram digitados.

const strip = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const STOPWORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'com', 'e', 'a', 'o', 'as', 'os', 'em', 'ao', 'na', 'no', 'para', 'ou']);

const PHRASES = {
  'bolo de chocolate': 'chocolate cake',
  'batata doce': 'sweet potato',
  'peito de frango': 'chicken breast',
  'carne moida': 'minced beef',
  'frutos do mar': 'seafood',
  'cafe da manha': 'breakfast',
  'grao de bico': 'chickpeas',
  'torta de maca': 'apple pie',
  'sopa de cebola': 'onion soup',
  'molho de tomate': 'tomato sauce',
  'creme de leite': 'cream',
  'leite condensado': 'condensed milk',
  'couve flor': 'cauliflower',
  'arroz doce': 'rice pudding',
};

const WORDS = {
  frango: 'chicken', galinha: 'chicken', carne: 'beef', boi: 'beef', bovina: 'beef', vaca: 'beef',
  porco: 'pork', bacon: 'bacon', linguica: 'sausage', salsicha: 'sausage', cordeiro: 'lamb',
  cabrito: 'goat', cabra: 'goat', peixe: 'fish', salmao: 'salmon', atum: 'tuna', bacalhau: 'cod',
  camarao: 'prawn', camaroes: 'prawns', lagosta: 'lobster', lula: 'squid', mexilhao: 'mussels',
  ovo: 'egg', ovos: 'eggs', batata: 'potato', batatas: 'potatoes', cenoura: 'carrot',
  cebola: 'onion', alho: 'garlic', tomate: 'tomato', arroz: 'rice', feijao: 'beans',
  lentilha: 'lentils', macarrao: 'pasta', massa: 'pasta', espaguete: 'spaghetti', lasanha: 'lasagne',
  nhoque: 'gnocchi', pizza: 'pizza', sopa: 'soup', salada: 'salad', bolo: 'cake', torta: 'pie',
  pao: 'bread', queijo: 'cheese', leite: 'milk', manteiga: 'butter', creme: 'cream',
  chocolate: 'chocolate', cafe: 'coffee', maca: 'apple', banana: 'banana', laranja: 'orange',
  limao: 'lemon', morango: 'strawberry', coco: 'coconut', abobora: 'pumpkin', cogumelo: 'mushroom',
  champignon: 'mushrooms', espinafre: 'spinach', brocolis: 'broccoli', pimentao: 'pepper',
  pimenta: 'chilli', milho: 'corn', ervilha: 'peas', abobrinha: 'courgette', berinjela: 'aubergine',
  pudim: 'pudding', torrada: 'toast', hamburguer: 'burger', sobremesa: 'dessert',
  vegetariano: 'vegetarian', vegano: 'vegan', curry: 'curry', mel: 'honey', farinha: 'flour',
  acucar: 'sugar', azeite: 'olive oil', sal: 'salt', presunto: 'ham', peru: 'turkey', pato: 'duck',
};

// Em "ingrediente" a API é literal: não existe o ingrediente "pasta".
const INGREDIENT_ALTERNATIVES = {
  macarrao: ['spaghetti', 'macaroni', 'penne_rigate'],
  massa: ['spaghetti', 'macaroni', 'penne_rigate'],
  pasta: ['spaghetti', 'macaroni', 'penne_rigate'],
};

const MAX_CANDIDATES = 4;

function translateWord(token) {
  if (WORDS[token]) return WORDS[token];
  if (token.endsWith('s') && WORDS[token.slice(0, -1)]) return WORDS[token.slice(0, -1)];
  return token;
}

/**
 * Lista ordenada de termos para tentar na API (do mais específico ao mais
 * genérico). O primeiro que devolver resultados é usado.
 */
export function buildQueries(text, mode) {
  const normalized = strip(text || '');
  if (!normalized) return [];

  const isIngredient = mode === 'ingredient';
  const format = (q) => (isIngredient ? q.trim().replace(/\s+/g, '_') : q.trim());
  const list = [];
  const add = (q) => {
    const value = format(q || '');
    if (value && !list.includes(value)) list.push(value);
  };

  const tokens = normalized.split(' ').filter((t) => !STOPWORDS.has(t));

  if (PHRASES[normalized]) add(PHRASES[normalized]);

  if (isIngredient && tokens.length === 1 && INGREDIENT_ALTERNATIVES[tokens[0]]) {
    INGREDIENT_ALTERNATIVES[tokens[0]].forEach(add);
  }

  const translated = tokens.map(translateWord);
  add(translated.join(' '));

  if (tokens.length > 1) {
    tokens.forEach((token, i) => {
      if (isIngredient && INGREDIENT_ALTERNATIVES[token]) {
        INGREDIENT_ALTERNATIVES[token].forEach(add);
      } else {
        add(translated[i]);
      }
    });
  }

  add(text.trim());
  return list.slice(0, MAX_CANDIDATES);
}
