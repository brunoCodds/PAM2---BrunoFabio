import { Pressable, StyleSheet } from 'react-native';
import Text from './Text';
import { colors, radius, shadows, web } from '../styles/theme';

/** Aviso temporário (ex.: erro ao buscar receita aleatória). Toque para fechar. */
export default function Toast({ message, onDismiss, bottom }) {
  if (!message) return null;
  return (
    <Pressable
      onPress={onDismiss}
      role="alert"
      style={[styles.toast, shadows.soft, { bottom }, web({ cursor: 'pointer' })]}
    >
      <Text variant="small" style={styles.text}>
        {message}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    maxWidth: 480,
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    backgroundColor: colors.forestDark,
    zIndex: 30,
  },
  text: { color: colors.paper, textAlign: 'center' },
});
