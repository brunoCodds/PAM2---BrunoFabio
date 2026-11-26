// A TheMealDB entrega nomes em inglês. Estes mapas só traduzem os rótulos
// de categoria e origem exibidos na interface; as requisições continuam
// usando o nome original da API.

const CATEGORIES = {
  Beef: 'Carne bovina',
  Breakfast: 'Café da manhã',
  Chicken: 'Frango',
  Dessert: 'Sobremesa',
  Goat: 'Cabrito',
  Lamb: 'Cordeiro',
  Miscellaneous: 'Variados',
  Pasta: 'Massas',
  Pork: 'Porco',
  Seafood: 'Frutos do mar',
  Side: 'Acompanhamentos',
  Starter: 'Entradas',
  Vegan: 'Vegano',
  Vegetarian: 'Vegetariano',
};

const AREAS = {
  American: 'Americana',
  British: 'Britânica',
  Canadian: 'Canadense',
  Chinese: 'Chinesa',
  Croatian: 'Croata',
  Dutch: 'Holandesa',
  Egyptian: 'Egípcia',
  Filipino: 'Filipina',
  French: 'Francesa',
  Greek: 'Grega',
  Indian: 'Indiana',
  Irish: 'Irlandesa',
  Italian: 'Italiana',
  Jamaican: 'Jamaicana',
  Japanese: 'Japonesa',
  Kenyan: 'Queniana',
  Malaysian: 'Malaia',
  Mexican: 'Mexicana',
  Moroccan: 'Marroquina',
  Polish: 'Polonesa',
  Portuguese: 'Portuguesa',
  Russian: 'Russa',
  Spanish: 'Espanhola',
  Thai: 'Tailandesa',
  Tunisian: 'Tunisiana',
  Turkish: 'Turca',
  Ukrainian: 'Ucraniana',
  Uruguayan: 'Uruguaia',
  Venezulan: 'Venezuelana',
  Vietnamese: 'Vietnamita',
};

export const categoryLabel = (name) => CATEGORIES[name] || name || '';

export const areaLabel = (name) => {
  if (!name || name === 'Unknown') return '';
  return AREAS[name] || name;
};
