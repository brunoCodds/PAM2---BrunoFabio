export const CRITERIA = [
  { key: 'price', label: 'Preço', hint: 'Quero gastar menos', reason: 'um aluguel que respeita seu orçamento' },
  { key: 'commute', label: 'Deslocamento', hint: 'Quero perder pouco tempo no trajeto', reason: 'um trajeto curto até o seu destino' },
  { key: 'safety', label: 'Segurança', hint: 'Quero priorizar segurança', reason: 'bons índices de segurança' },
  { key: 'commerce', label: 'Comércio', hint: 'Mercados, restaurantes e serviços por perto', reason: 'comércio e serviços abundantes' },
  { key: 'quality', label: 'Qualidade de vida', hint: 'Parques, áreas verdes e tranquilidade', reason: 'qualidade de vida e áreas verdes' },
  { key: 'mobility', label: 'Mobilidade', hint: 'Perto de transporte público', reason: 'uma ótima rede de transporte' },
];
export const DEFAULT_WEIGHTS = { price: 55, commute: 90, safety: 90, commerce: 55, quality: 20, mobility: 55 };
export const MODES = [['transit', '🚇 Transporte público'], ['car', '🚗 Carro'], ['bike', '🚲 Bicicleta'], ['walk', '🚶 Caminhando']];
const MODE_FACTOR = { transit: 1, car: 0.75, bike: 1.3, walk: 3.2 };
const clamp = (n) => Math.max(0, Math.min(100, n));
export const brl = (n) => 'R$ ' + Math.round(n).toLocaleString('pt-BR');
export const tone = (s) => (s >= 90 ? '#10B981' : s >= 75 ? '#F59E0B' : '#EF4444');

export function weightShare(w) {
  const total = Object.values(w).reduce((a, b) => a + b, 0) || 1;
  const out = {};
  Object.keys(w).forEach((k) => { out[k] = w[k] / total; });
  return out;
}
// score = Σ (nota do critério × peso normalizado) → 0–100. Algoritmo aberto, sem caixa-preta.
export function scoreNeighborhood(n, p, w = p.weights) {
  const commute = Math.round(n.commuteTime * MODE_FACTOR[p.mode]);
  const r = n.averageRent / p.budget, t = commute / p.maxCommute;
  const parts = {
    price: clamp(r <= 1 ? 70 + (1 - r) * 100 : 70 - (r - 1) * 200),
    commute: clamp(t <= 1 ? 100 - t * 30 : 70 - (t - 1) * 150),
    safety: n.safety * 10, commerce: n.commerce * 10, quality: n.qualityOfLife * 10, mobility: n.transportation * 10,
  };
  const sh = weightShare(w);
  const score = Math.round(Object.keys(parts).reduce((a, k) => a + parts[k] * sh[k], 0));
  return { ...n, score, parts, commute };
}
export const rank = (list, p, w) => list.map((n) => scoreNeighborhood(n, p, w)).sort((a, b) => b.score - a.score);
export function tagsFor(n) {
  const t = [];
  if (n.transportation >= 9) t.push('Perto do metrô');
  if (n.commerce >= 9) t.push('Comércio forte');
  if (n.safety >= 8.5) t.push('Muito seguro');
  if (n.greenAreas >= 8.5) t.push('Áreas verdes');
  if (n.commute <= 20) t.push('Trajeto curto');
  return t.length ? t.slice(0, 3) : ['Equilibrado'];
}
export const SCENARIOS = [
  { id: 'eco', label: '💰 Economizar', text: 'Se preço for sua prioridade…', boost: 'price' },
  { id: 'commute', label: '🚇 Menos deslocamento', text: 'Se você priorizar o trajeto…', boost: 'commute' },
  { id: 'safe', label: '🛡 Mais segurança', text: 'Se segurança for sua prioridade…', boost: 'safety' },
  { id: 'life', label: '🌳 Qualidade de vida', text: 'Se você priorizar tranquilidade…', boost: 'quality' },
];
