import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { brl, tone } from '../utils/scoring';
import { C } from './ui';
// Mapa ilustrativo (Views posicionadas por %). Coordenadas fictícias — não é um mapa real.
const px = (lon) => ((lon + 46.71) / 0.11) * 80 + 10;
const py = (lat) => ((-23.52 - lat) / 0.1) * 66 + 12;
export default function CityMap({ items, selectedId, onSelect, height = 340 }) {
  const sel = items.find((i) => i.id === selectedId);
  return (
    <View style={[s.map, { height }]}>
      <View style={s.river} />
      <View style={[s.road, { top: '50%', left: 0, right: 0, height: 5 }]} />
      <View style={[s.road, { left: '50%', top: 0, bottom: 0, width: 4 }]} />
      {items.map((n) => {
        const on = n.id === selectedId;
        return (
          <TouchableOpacity key={n.id} accessibilityLabel={`${n.name}, ${n.score}% compatível`} onPress={() => onSelect(on ? null : n.id)}
            style={{ position: 'absolute', left: `${px(n.longitude)}%`, top: `${py(n.latitude)}%`, width: 76, marginLeft: -38, alignItems: 'center', zIndex: on ? 5 : 1 }}>
            <View style={[s.dot, { backgroundColor: tone(n.score), width: on ? 38 : 30, height: on ? 38 : 30, borderRadius: 19 }]}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 11 }}>{n.score}</Text>
            </View>
            <Text style={s.lbl} numberOfLines={1}>{n.name}</Text>
            <Text style={s.price}>{brl(n.averageRent)}</Text>
          </TouchableOpacity>
        );
      })}
      <View style={s.legend}><Text style={{ fontSize: 11, fontWeight: '600' }}>🟢 90%+  🟡 75–89%  🔴 &lt;75%</Text></View>
      <Text style={s.note}>Mapa ilustrativo · dados fictícios</Text>
      {sel && (
        <View style={s.tip}>
          <Text style={{ color: '#fff', fontWeight: '800' }}>{sel.name}</Text>
          <Text style={{ color: '#fff' }}>{sel.score}% compatível</Text>
          <Text style={{ color: '#CBD5E1' }}>{brl(sel.averageRent)} · {sel.commute} min</Text>
        </View>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  map: { backgroundColor: '#F1F5F9', borderRadius: 16, borderWidth: 1, borderColor: C.line, overflow: 'hidden' },
  river: { position: 'absolute', top: '12%', left: -20, right: -20, height: 16, backgroundColor: '#BFDBFE', transform: [{ rotate: '3deg' }] },
  road: { position: 'absolute', backgroundColor: '#fff' },
  dot: { alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: '#fff' },
  lbl: { fontSize: 10, fontWeight: '700', color: C.ink, marginTop: 2 },
  price: { fontSize: 9, color: C.mute },
  legend: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(255,255,255,.92)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  note: { position: 'absolute', bottom: 6, right: 10, fontSize: 9, color: '#94A3B8' },
  tip: { position: 'absolute', bottom: 22, left: 10, backgroundColor: C.ink, borderRadius: 12, padding: 10, zIndex: 9 },
});
