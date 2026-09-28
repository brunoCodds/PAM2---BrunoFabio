import { MOCK_NEIGHBORHOODS } from '../data/neighborhoods';
import { CRITERIA, weightShare, brl } from '../utils/scoring';
// Camada de dados: hoje devolve MOCKS. Troque o corpo por fetch() para uma API real.
export async function fetchNeighborhoods() {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_NEIGHBORHOODS;
}
// Ponto de integração com LLM. Hoje gera o texto por regras a partir dos dados.
export function generateExplanation(n, position, p) {
  const sh = weightShare(p.weights);
  const top = CRITERIA.map((c) => ({ c, v: n.parts[c.key] * sh[c.key] })).sort((a, b) => b.v - a.v).slice(0, 2);
  const budget = n.averageRent <= p.budget
    ? 'O aluguel cabe no seu orçamento.'
    : `O aluguel fica ${brl(n.averageRent - p.budget)} acima do seu limite, mas suas outras prioridades compensam.`;
  return `${n.name} aparece em ${position}º lugar principalmente por ${top[0].c.reason} e ${top[1].c.reason}. ${budget}`;
}
