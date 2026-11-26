import { Pressable, StyleSheet } from 'react-native';
import Text from './Text';
import { colors, shadows, web } from '../styles/theme';

export default function FavoriteButton({ active, onPress, name }) {
  const label = active ? `Remover ${name} dos favoritos` : `Adicionar ${name} aos favoritos`;
  return (
    <Pressable
      onPress={onPress}
      role="button"
      aria-label={label}
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      hitSlop={6}
      style={({ hovered, pressed }) => [
        styles.button,
        shadows.lift,
        (hovered || pressed) && { backgroundColor: colors.orangeSoft },
        web({ cursor: 'pointer', transitionProperty: 'background-color', transitionDuration: '150ms' }),
      ]}
    >
      <Text style={[styles.heart, { color: active ? colors.orange : colors.forest }]}>{active ? '♥' : '♡'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: { fontSize: 22, lineHeight: 26, textAlign: 'center' },
});
