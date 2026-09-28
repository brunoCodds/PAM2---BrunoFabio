import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { useRecommendations } from '../hooks/useRecommendations';
import { generateExplanation } from '../services/recommendationService';
import { Bar, C, card } from '../components/ui';
import { brl, tone } from '../utils/scoring';

export default function BairroScreen({ route }) {
  const { prefs } = useApp();
  const { ranked, loading } = useRecommendations(prefs);
  const idx = ranked.findIndex((n) => n.id === route.params.id);
  const n = ranked[idx];
  if (loading) return <Text style={{ padding: 24, color: C.mute }}>Carregando análise…</Text>;
  if (!n) return <Text style={{ padding: 24 }}>Bairro não encontrado.</Text>;
  const over = n.averageRent > prefs.budget;
  const good = [n.transportation >= 8.5 && 'Metrô e ônibus próximos', n.commerce >= 8.5 && 'Diversidade de comércio', n.qualityOfLife >= 8.5 && 'Boa qualidade de vida', n.safety >= 8.5 && 'Bons índices de segurança', !over && 'Aluguel dentro do orçamento'].filter(Boolean);
  const warn = [over && 'Aluguel acima do seu orçamento', n.safety < 7.5 && 'Algumas áreas apresentam maior movimento', n.greenAreas < 6 && 'Poucas áreas verdes', n.commute > prefs.maxCommute && 'Deslocamento acima do desejado'].filter(Boolean);
  const data = [['Aluguel (adequação)', n.parts.price], ['Segurança', n.safety * 10], ['Transporte', n.transportation * 10], ['Comércio', n.commerce * 10], ['Áreas verdes', n.greenAreas * 10], ['Qualidade de vida', n.qualityOfLife * 10]];
  return (
    <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, maxWidth: 720, width: '100%', alignSelf: 'center' }}>
      <Text style={s.h1}>{n.name}</Text>
      <Text style={{ fontSize: 17, fontWeight: '700', color: tone(n.score) }}>{n.score}% compatível com suas preferências</Text>
      <Text style={s.p}>{generateExplanation(n, idx + 1, prefs)}</Text>
      <View style={[card, { marginTop: 16 }]}>
        <Text style={s.h2}>Por que esse bairro combina com você?</Text>
        <Text style={s.p}>Aluguel médio {brl(n.averageRent)} · Deslocamento {n.commute} min</Text>
        <Text style={[s.h2, { color: C.good, marginTop: 14 }]}>Pontos positivos</Text>
        {good.map((g) => <Text key={g} style={s.p}>• {g}</Text>)}
        <Text style={[s.h2, { color: C.warn, marginTop: 14 }]}>Pontos de atenção</Text>
        {(warn.length ? warn : ['Nenhum ponto crítico para o seu perfil']).map((g) => <Text key={g} style={s.p}>• {g}</Text>)}
      </View>
      <View style={[card, { marginTop: 16 }]}>
        <Text style={s.h2}>Dados</Text>
        {data.map(([l, v]) => <View key={l} style={{ marginTop: 10 }}><Text style={{ fontSize: 13, marginBottom: 4 }}>{l}: <Text style={{ fontWeight: '700' }}>{Math.round(v)}</Text></Text><Bar value={v} /></View>)}
      </View>
      <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 14 }}>Dados fictícios (mock) para demonstração.</Text>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  h1: { fontSize: 32, fontWeight: '800', color: C.ink, letterSpacing: -0.5 },
  h2: { fontSize: 16, fontWeight: '800', color: C.ink }, p: { fontSize: 14, color: '#475569', marginTop: 6, lineHeight: 20 },
});
