import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export const C = { bg: '#F8FAFC', ink: '#0F172A', brand: '#2563EB', good: '#10B981', warn: '#F59E0B', bad: '#EF4444', mute: '#64748B', line: '#E2E8F0' };
export function Btn({ title, onPress, kind = 'primary', disabled, style }) {
  const bg = kind === 'primary' ? C.brand : kind === 'dark' ? C.ink : '#fff';
  return (
    <TouchableOpacity accessibilityRole="button" disabled={disabled} onPress={onPress} activeOpacity={0.8}
      style={[s.btn, { backgroundColor: bg, borderWidth: kind === 'ghost' ? 1 : 0, borderColor: C.line, opacity: disabled ? 0.4 : 1 }, style]}>
      <Text style={{ color: kind === 'ghost' ? C.ink : '#fff', fontWeight: '700', fontSize: 15 }}>{title}</Text>
    </TouchableOpacity>
  );
}
export function Chip({ label, on, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} accessibilityRole="button" style={[s.chip, on && { borderColor: C.brand, backgroundColor: '#EFF6FF' }]}>
      <Text style={{ color: on ? C.brand : C.ink, fontWeight: '600', fontSize: 13 }}>{label}</Text>
    </TouchableOpacity>
  );
}
const LEVELS = [['Baixo', 20], ['Médio', 55], ['Alto', 90]];
export function Segment({ value, onChange }) {
  const lvl = value < 34 ? 0 : value < 67 ? 1 : 2;
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {LEVELS.map(([l, v], i) => <Chip key={l} label={l} on={i === lvl} onPress={() => onChange(v)} />)}
    </View>
  );
}
export function Bar({ value, color = C.brand }) {
  return <View style={s.track}><View style={{ height: 6, borderRadius: 3, width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }} /></View>;
}
export const card = { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: C.line, padding: 16 };
const s = StyleSheet.create({
  btn: { borderRadius: 12, paddingVertical: 13, paddingHorizontal: 18, alignItems: 'center' },
  chip: { borderWidth: 1, borderColor: C.line, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 12, backgroundColor: '#fff' },
  track: { height: 6, borderRadius: 3, backgroundColor: '#E2E8F0', overflow: 'hidden' },
});
