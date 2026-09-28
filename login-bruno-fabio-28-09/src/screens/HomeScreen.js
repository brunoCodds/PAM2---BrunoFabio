import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { Btn, Chip, Segment, C, card } from '../components/ui';
import { CRITERIA, MODES, brl } from '../utils/scoring';

const PLACES = ['Avenida Paulista, São Paulo', 'Faria Lima, São Paulo', 'Praça da Sé, São Paulo', 'USP — Cidade Universitária'];
const BUDGETS = [2000, 3500, 5000, 7000];

// Tela inicial do app (depois do login/cadastro): fluxo em 4 etapas do DecideMap.
export default function HomeScreen({ navigation, route }) {
  const nome = route?.params?.nome ?? 'usuário';
  const { prefs, setPrefs } = useApp();
  const [step, setStep] = useState(0);
  const set = (k, v) => setPrefs({ ...prefs, [k]: v });
  const last = step === 3;

  return (
    <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={s.wrap}>
      <View style={s.top}>
        <Text style={s.hello}>Olá, {nome.split(' ')[0]} 👋</Text>
        <Btn title="Sair" kind="ghost" onPress={() => navigation.replace('Login')} style={{ paddingVertical: 8 }} />
      </View>
      <View style={s.prog}>
        <Text style={s.step}>{step + 1} de 4</Text>
        <View style={s.track}><View style={[s.fill, { width: `${((step + 1) / 4) * 100}%` }]} /></View>
      </View>

      {step === 0 && (
        <View>
          <Text style={s.h1}>Onde você trabalha ou estuda?</Text>
          <TextInput style={s.input} value={prefs.workplace} onChangeText={(v) => set('workplace', v)} placeholder="Digite um endereço, bairro ou ponto de referência" />
          <View style={s.row}>{PLACES.map((p) => <Chip key={p} label={p} on={prefs.workplace === p} onPress={() => set('workplace', p)} />)}</View>
        </View>
      )}
      {step === 1 && (
        <View>
          <Text style={s.h1}>Quanto você pretende gastar com aluguel?</Text>
          <Text style={s.big}>{brl(prefs.budget)}<Text style={s.small}>/mês</Text></Text>
          <View style={s.row}>
            <Btn title="− R$ 250" kind="ghost" onPress={() => set('budget', Math.max(1500, prefs.budget - 250))} />
            <Btn title="+ R$ 250" kind="ghost" onPress={() => set('budget', Math.min(10000, prefs.budget + 250))} />
          </View>
          <View style={[s.row, { marginTop: 12 }]}>{BUDGETS.map((b) => <Chip key={b} label={brl(b)} on={prefs.budget === b} onPress={() => set('budget', b)} />)}</View>
          <Text style={s.hint}>Entre R$ 1.500 e R$ 10.000</Text>
        </View>
      )}
      {step === 2 && (
        <View>
          <Text style={s.h1}>Quanto tempo você aceita gastar no deslocamento?</Text>
          <View style={s.row}>{[20, 30, 40, 60, 90].map((m) => <Chip key={m} label={`Até ${m} min`} on={prefs.maxCommute === m} onPress={() => set('maxCommute', m)} />)}</View>
          <Text style={[s.h2]}>Como você vai se deslocar?</Text>
          <View style={s.row}>{MODES.map(([k, l]) => <Chip key={k} label={l} on={prefs.mode === k} onPress={() => set('mode', k)} />)}</View>
        </View>
      )}
      {step === 3 && (
        <View>
          <Text style={s.h1}>O que mais importa para você?</Text>
          <Text style={s.hint}>Você pode mudar essas prioridades depois.</Text>
          {CRITERIA.map((c) => (
            <View key={c.key} style={[card, { marginTop: 12 }]}>
              <Text style={{ fontWeight: '700', fontSize: 15 }}>{c.label}</Text>
              <Text style={[s.hint, { marginBottom: 10 }]}>{c.hint}</Text>
              <Segment value={prefs.weights[c.key]} onChange={(v) => set('weights', { ...prefs.weights, [c.key]: v })} />
            </View>
          ))}
        </View>
      )}

      <View style={{ marginTop: 28, gap: 10 }}>
        <Btn title={last ? 'Ver meus bairros' : 'Continuar'} onPress={() => (last ? navigation.navigate('Resultados') : setStep(step + 1))} />
        {step > 0 && <Btn title="Voltar" kind="ghost" onPress={() => setStep(step - 1)} />}
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  wrap: { padding: 20, paddingTop: 48, maxWidth: 680, width: '100%', alignSelf: 'center' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  hello: { fontSize: 16, fontWeight: '700', color: C.ink },
  prog: { marginBottom: 24 }, step: { fontSize: 13, color: C.mute, marginBottom: 6, fontWeight: '600' },
  track: { height: 6, borderRadius: 3, backgroundColor: '#E2E8F0' }, fill: { height: 6, borderRadius: 3, backgroundColor: C.brand },
  h1: { fontSize: 26, fontWeight: '800', color: C.ink, marginBottom: 16, letterSpacing: -0.5 },
  h2: { fontSize: 16, fontWeight: '700', marginTop: 24, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, backgroundColor: '#fff', padding: 14, fontSize: 16, marginBottom: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  big: { fontSize: 38, fontWeight: '800', color: C.brand, marginBottom: 14 }, small: { fontSize: 16, color: C.mute, fontWeight: '500' },
  hint: { fontSize: 13, color: C.mute, marginTop: 8 },
});
