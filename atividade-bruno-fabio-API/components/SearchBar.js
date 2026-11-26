import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Button from './Button';
import Text from './Text';
import { colors, fonts, radius, shadows, web } from '../styles/theme';
import { useLayout } from '../utils/layout';

export const SEARCH_MODES = [
  { value: 'name', label: 'Nome da receita', placeholder: 'Ex.: bolo de chocolate' },
  { value: 'ingredient', label: 'Ingrediente', placeholder: 'Ex.: frango ou batata' },
];

const EXAMPLES = ['Frango', 'Batata', 'Macarrão', 'Bolo de chocolate'];

/**
 * Barra de pesquisa com escolha entre nome e ingrediente.
 * `onSubmit(mode, query)` só é chamado quando há texto.
 */
export default function SearchBar({ initialMode = 'name', initialQuery = '', onSubmit, showExamples = false, autoFocus = false }) {
  const { isMobile } = useLayout();
  const [mode, setMode] = useState(initialMode);
  const [query, setQuery] = useState(initialQuery);
  const [focused, setFocused] = useState(false);
  const [hint, setHint] = useState('');

  const current = SEARCH_MODES.find((m) => m.value === mode);

  const submit = (nextMode, text) => {
    const value = text.trim();
    if (!value) {
      setHint('Digite o nome de uma receita ou de um ingrediente.');
      return;
    }
    setHint('');
    onSubmit(nextMode, value);
  };

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.field,
          shadows.soft,
          focused && { borderColor: colors.forest },
          isMobile && styles.fieldMobile,
        ]}
        role="search"
      >
        <TextInput
          value={query}
          onChangeText={(t) => {
            setQuery(t);
            if (hint) setHint('');
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={() => submit(mode, query)}
          placeholder={current.placeholder}
          placeholderTextColor="#8A9890"
          returnKeyType="search"
          autoFocus={autoFocus}
          aria-label={`Buscar receitas por ${current.label.toLowerCase()}`}
          style={[styles.input, web({ outlineStyle: 'none' })]}
        />
        <Button label="Buscar" size={isMobile ? 'sm' : 'md'} onPress={() => submit(mode, query)} />
      </View>

      {hint ? (
        <Text variant="small" role="alert" style={styles.hint}>
          {hint}
        </Text>
      ) : null}

      <View style={styles.modes} role="radiogroup" aria-label="Tipo de busca">
        <Text variant="small">Buscar por</Text>
        {SEARCH_MODES.map((m) => {
          const selected = m.value === mode;
          return (
            <Pressable
              key={m.value}
              onPress={() => setMode(m.value)}
              role="radio"
              aria-checked={selected}
              accessibilityState={{ selected }}
              style={({ hovered }) => [
                styles.mode,
                selected && styles.modeSelected,
                !selected && hovered && { backgroundColor: colors.sage },
                web({ cursor: 'pointer' }),
              ]}
            >
              <Text variant="caption" style={{ color: selected ? colors.paper : colors.forest, fontSize: 14 }}>
                {m.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {showExamples ? (
        <View style={styles.modes}>
          <Text variant="small">Experimente</Text>
          {EXAMPLES.map((example) => (
            <Pressable
              key={example}
              onPress={() => {
                setQuery(example);
                submit(mode, example);
              }}
              role="button"
              style={({ hovered }) => [styles.example, hovered && { borderColor: colors.forest }, web({ cursor: 'pointer' })]}
            >
              <Text variant="caption" style={{ color: colors.forest, fontSize: 14 }}>
                {example}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14, width: '100%' },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paper,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingLeft: 24,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 12,
  },
  fieldMobile: { paddingLeft: 16 },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.ink,
  },
  hint: { color: colors.danger, fontWeight: '600', paddingLeft: 12 },
  modes: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, paddingLeft: 4 },
  mode: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.sage,
  },
  modeSelected: { backgroundColor: colors.forest },
  example: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
  },
});
