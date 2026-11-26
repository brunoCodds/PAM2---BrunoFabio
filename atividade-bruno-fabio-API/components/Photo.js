import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Text from './Text';
import { colors } from '../styles/theme';

/** Imagem com fundo suave enquanto carrega e aviso quando falha ou não existe. */
export default function Photo({ uri, alt, style, resizeMode = 'cover', fallbackLabel = 'Sem imagem' }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [uri]);

  if (!uri || failed) {
    return (
      <View style={[styles.fallback, style]}>
        {fallbackLabel ? <Text variant="caption">{fallbackLabel}</Text> : null}
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      alt={alt}
      accessibilityLabel={alt}
      resizeMode={resizeMode}
      onError={() => setFailed(true)}
      style={[styles.image, style]}
    />
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.sage },
  fallback: { backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
});
