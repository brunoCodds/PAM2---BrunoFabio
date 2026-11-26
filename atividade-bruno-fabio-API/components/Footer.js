import { Linking, StyleSheet, View } from 'react-native';
import Container from './Container';
import Text from './Text';
import { colors, web } from '../styles/theme';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Container style={styles.inner}>
        <Text variant="small">Receita Fácil reúne receitas da TheMealDB, um catálogo aberto de culinária.</Text>
        <Text
          variant="small"
          role="link"
          onPress={() => Linking.openURL('https://www.themealdb.com').catch(() => {})}
          style={[styles.link, web({ cursor: 'pointer' })]}
        >
          themealdb.com
        </Text>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { borderTopWidth: 1, borderTopColor: colors.line, marginTop: 24 },
  inner: { paddingVertical: 28, gap: 4 },
  link: { color: colors.forest, textDecorationLine: 'underline', fontWeight: '600' },
});
