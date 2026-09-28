import { useMemo, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useApp } from '../context/AppContext';
import { useRecommendations } from '../hooks/useRecommendations';
import { generateExplanation } from '../services/recommendationService';
import CityMap from '../components/CityMap';
import { Bar, Btn, Chip, Segment, C, card } from '../components/ui';
import { CRITERIA, SCENARIOS, brl, rank, tagsFor, tone, weightShare } from '../utils/scoring';

function NeighborhoodCard({ n, pos, prefs, delta, active, checked, onCompare, onSelect, onOpen }) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onSelect} style={[card, { marginBottom: 14 }, active && { borderColor: C.brand, borderWidth: 2 }]}>
      <View style={s.between}>
        <View style={{ flex: 1 }}>
          <Text style={s.name}>#{pos} {n.name} {delta !== 0 && <Text style={{ color: delta > 0 ? C.good : C.bad, fontSize: 12 }}>{delta > 0 ? '▲' : '▼'}{Math.abs(delta)}</Text>}</Text>
          <View style={s.tags}>{tagsFor(n).map((t) => <Text key={t} style={s.tag}>{t}</Text>)}</View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 26, fontWeight: '800', color: tone(n.score) }}>{n.score}%</Text>
          <Text style={s.mute}>compatível</Text>
        </View>
      </View>
      <View style={{ marginVertical: 10 }}><Bar value={n.score} color={tone(n.score)} /></View>
      <Text style={s.line}>🏠 Aluguel médio: <Text style={s.b}>{brl(n.averageRent)}</Text>   🚇 <Text style={s.b}>{n.commute} min</Text></Text>
      <Text style={s.line}>🛡 Segurança: <Text style={s.b}>{n.safety}/10</Text>   🛒 Comércio: <Text style={s.b}>{n.commerce}/10</Text></Text>
      <Text style={s.line}>🌳 Qualidade de vida: <Text style={s.b}>{n.qualityOfLife}/10</Text></Text>
      <Text style={s.expl}>{generateExplanation(n, pos, prefs)}</Text>
      <View style={[s.between, { marginTop: 12 }]}>
        <Chip label={checked ? '✓ Comparando' : 'Comparar'} on={checked} onPress={onCompare} />
        <Btn title="Ver análise" onPress={onOpen} style={{ paddingVertical: 9 }} />
      </View>
    </TouchableOpacity>
  );
}

export default function ResultadosScreen({ navigation }) {
  const { prefs, setPrefs, compare, toggleCompare } = useApp();
  const { ranked, loading } = useRecommendations(prefs);
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const [view, setView] = useState('list');
  const [sel, setSel] = useState(null);
  const [how, setHow] = useState(false);
  const prev = useRef([]);
  const top = ranked.slice(0, 8);
  const deltas = useMemo(() => {
    const d = {};
    top.forEach((n, i) => { const p = prev.current.indexOf(n.id); d[n.id] = p < 0 ? 0 : p - i; });
    prev.current = top.map((n) => n.id);
    return d;
  }, [ranked]); // eslint-disable-line react-hooks/exhaustive-deps
  const scenarios = useMemo(() => SCENARIOS.map((sc) => ({ ...sc, list: rank(ranked, prefs, { ...prefs.weights, [sc.boost]: 100 }).slice(0, 3) })), [ranked, prefs]);
  const sh = weightShare(prefs.weights);

  const list = loading ? <Text style={s.mute}>Calculando seus bairros…</Text> : top.map((n, i) => (
    <NeighborhoodCard key={n.id} n={n} pos={i + 1} prefs={prefs} delta={deltas[n.id] ?? 0} active={sel === n.id}
      checked={compare.includes(n.id)} onCompare={() => toggleCompare(n.id)} onSelect={() => setSel(n.id)} onOpen={() => navigation.navigate('Bairro', { id: n.id })} />
  ));
  const map = <CityMap items={top} selectedId={sel} onSelect={setSel} height={wide ? 520 : 340} />;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={s.wrap}>
        <Text style={s.h1}>Encontramos {top.length || 8} bairros que combinam com você.</Text>
        <Text style={s.mute}>Consideramos seu orçamento ({brl(prefs.budget)}), deslocamento (até {prefs.maxCommute} min) e prioridades.</Text>
        <View style={[s.row, { marginTop: 12 }]}>
          <Btn title="Como calculamos?" kind="ghost" onPress={() => setHow(true)} style={{ paddingVertical: 9 }} />
          <Btn title="Refazer análise" kind="ghost" onPress={() => navigation.navigate('Home')} style={{ paddingVertical: 9 }} />
        </View>

        <View style={[card, { marginTop: 16 }]}>
          <Text style={s.name}>Ajuste sua decisão</Text>
          {CRITERIA.map((c) => (
            <View key={c.key} style={[s.between, { marginTop: 10 }]}>
              <Text style={{ fontSize: 14, fontWeight: '600', flex: 1 }}>{c.label}</Text>
              <Segment value={prefs.weights[c.key]} onChange={(v) => setPrefs({ ...prefs, weights: { ...prefs.weights, [c.key]: v } })} />
            </View>
          ))}
        </View>

        {!wide && (
          <View style={[s.row, { marginTop: 16 }]}>
            <Chip label="Lista" on={view === 'list'} onPress={() => setView('list')} />
            <Chip label="Mapa" on={view === 'map'} onPress={() => setView('map')} />
          </View>
        )}
        <View style={{ marginTop: 16, flexDirection: wide ? 'row' : 'column', gap: 16 }}>
          {(wide || view === 'list') && <View style={{ flex: 1 }}>{list}</View>}
          {(wide || view === 'map') && <View style={{ flex: 1 }}>{map}</View>}
        </View>

        <Text style={[s.h1, { marginTop: 24, fontSize: 22 }]}>E se você mudar sua prioridade?</Text>
        <Text style={s.mute}>Não existe um único “melhor bairro”. Veja como o pódio muda.</Text>
        <View style={{ marginTop: 12, gap: 12 }}>
          {scenarios.map((sc) => (
            <View key={sc.id} style={card}>
              <Text style={s.name}>{sc.label}</Text>
              <Text style={s.mute}>{sc.text}</Text>
              {sc.list.map((n, i) => {
                const was = ranked.findIndex((r) => r.id === n.id);
                return <Text key={n.id} style={[s.line, { marginTop: 6 }]}>{i + 1}. {n.name} — <Text style={s.b}>{n.score}%</Text>{was > i ? <Text style={{ color: C.good }}> ▲{was - i}</Text> : null}</Text>;
              })}
            </View>
          ))}
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>

      {compare.length >= 2 && (
        <View style={s.fab}><Btn title={`Comparar ${compare.length} bairros`} kind="dark" onPress={() => navigation.navigate('Comparar')} /></View>
      )}
      <Modal visible={how} transparent animationType="fade" onRequestClose={() => setHow(false)}>
        <View style={s.overlay}>
          <View style={[card, { width: '100%', maxWidth: 420, padding: 22 }]}>
            <Text style={s.name}>Como calculamos?</Text>
            <Text style={[s.mute, { marginVertical: 8 }]}>Sua compatibilidade é calculada usando as prioridades que você definiu. Cada critério recebe nota de 0 a 100 e é multiplicado pelo seu peso.</Text>
            {CRITERIA.map((c) => <View key={c.key} style={[s.between, { marginTop: 6 }]}><Text>{c.label}</Text><Text style={s.b}>{Math.round(sh[c.key] * 100)}%</Text></View>)}
            <Text style={[s.mute, { marginTop: 12, fontSize: 12 }]}>score = Σ (nota do critério × peso) → 0–100. Os dados dos bairros são fictícios (mock).</Text>
            <Btn title="Fechar" onPress={() => setHow(false)} style={{ marginTop: 14 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
const s = StyleSheet.create({
  wrap: { padding: 20, maxWidth: 1200, width: '100%', alignSelf: 'center' },
  h1: { fontSize: 26, fontWeight: '800', color: C.ink, letterSpacing: -0.5, marginBottom: 6 },
  mute: { color: C.mute, fontSize: 14 }, b: { fontWeight: '700', color: C.ink },
  name: { fontSize: 17, fontWeight: '800', color: C.ink }, line: { fontSize: 13, color: C.mute, marginTop: 3 },
  expl: { fontSize: 13, color: '#475569', marginTop: 10, lineHeight: 19 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  tag: { fontSize: 11, fontWeight: '600', color: '#475569', backgroundColor: '#F1F5F9', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3, overflow: 'hidden' },
  fab: { position: 'absolute', bottom: 20, alignSelf: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(15,23,42,.45)', alignItems: 'center', justifyContent: 'center', padding: 20 },
});
