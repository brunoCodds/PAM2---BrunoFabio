import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Button from './Button';
import Text from './Text';
import { colors, radius } from '../styles/theme';

export function LoadingState({ label = 'Carregando...' }) {
  return (
    <View style={styles.box} accessibilityLiveRegion="polite">
      <ActivityIndicator size="large" color={colors.forest} />
      <Text variant="small" style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <View style={[styles.box, styles.errorBox]} role="alert">
      <Text variant="heading" style={styles.heading}>
        Algo deu errado
      </Text>
      <Text style={styles.message}>{message || 'Não foi possível carregar os dados.'}</Text>
      {onRetry ? <Button label="Tentar de novo" onPress={onRetry} variant="primary" /> : null}
    </View>
  );
}

export function EmptyState({ title, message, actions }) {
  return (
    <View style={styles.box}>
      <Text variant="heading" style={styles.heading}>
        {title}
      </Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 12,
  },
  errorBox: {
    backgroundColor: colors.orangeSoft,
    borderRadius: radius.lg,
  },
  label: { marginTop: 4 },
  heading: { textAlign: 'center' },
  message: { textAlign: 'center', maxWidth: 460, color: colors.muted },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 8 },
});
