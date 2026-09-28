import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { useRecommendations } from '../hooks/useRecommendations';
import { Bar, C, card } from '../components/ui';
import { brl } from '../utils/scoring';

const COLORS = [C.brand, C.good, C.warn];
export default function CompararScreen() {
  const { prefs, compare } = useApp();
  const { ranked, loading } = useRecommendations(prefs);
  const items = ranked.filter((n) => compare.includes(n.id));
  if (loading) return <Text style={{ padding: 24, color: C.mute }}>Carregando…</Text>;
  if (items.length < 2) return <Text style={{ padding: 24 }}>Selecione ao menos 2 bairros na lista para comparar.</Text>;
  const rows = [['Compatibilidade', (n) => `${n.score}%`], ['Aluguel', (n) => brl(n.averageRent)], ['Deslocamento', (n) => `${n.commute} min`], ['Transporte', (n) => n.transportation], ['Segurança', (n) => n.safety], ['Comércio', (n) => n.commerce], ['Qualidade de vida', (n) => n.qualityOfLife]];
  const bars = [['Transporte', 'transportation'], ['Segurança', 'safety'], ['Comércio', 'commerce'], ['Qualidade de vida', 'qualityOfLife']];
  return (
    <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, maxWidth: 820, width: '100%', alignSelf: 'center' }}>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={card}>
          <View style={s.row}><Text style={[s.cell, s.head]}>Critério</Text>{items.map((n) => <Text key={n.id} style={[s.cell, s.head]}>{n.name}</Text>)}</View>
          {rows.map(([l, f]) => <View key={l} style={s.row}><Text style={[s.cell, { color: C.mute }]}>{l}</Text>{items.map((n) => <Text key={n.id} style={[s.cell, { fontWeight: '700' }]}>{f(n)}</Text>)}</View>)}
        </View>
      </ScrollView>
      <View style={[card, { marginTop: 16 }]}>
        <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap' }}>{items.map((n, i) => <Text key={n.id} style={{ color: COLORS[i], fontWeight: '700' }}>● {n.name}</Text>)}</View>
        {bars.map(([l, k]) => (
          <View key={k} style={{ marginTop: 14 }}>
            <Text style={{ fontWeight: '700', marginBottom: 6 }}>{l}</Text>
            {items.map((n, i) => <View key={n.id} style={{ marginBottom: 5 }}><Bar value={n[k] * 10} color={COLORS[i]} /></View>)}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  cell: { width: 130, paddingVertical: 10, fontSize: 13, color: C.ink }, head: { fontWeight: '800' },
});
