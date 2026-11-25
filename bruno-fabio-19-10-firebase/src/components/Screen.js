import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, space } from '../theme';

// Página rolável com coluna central. `narrow` serve para telas de formulário.
export default function Screen({ children, narrow = false }) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.column, narrow && styles.narrow]}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { alignItems: 'center', padding: space.lg, paddingTop: space.xl, paddingBottom: 56 },
  column: { width: '100%', maxWidth: 720, gap: space.xl },
  narrow: { maxWidth: 440 },
});
