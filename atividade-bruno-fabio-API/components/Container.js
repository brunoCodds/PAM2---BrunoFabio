import { View } from 'react-native';
import { MAX_WIDTH, useLayout } from '../utils/layout';

/** Coluna central com largura máxima e margens laterais responsivas. */
export default function Container({ children, style }) {
  const { gutter } = useLayout();
  return (
    <View style={[{ width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center', paddingHorizontal: gutter }, style]}>
      {children}
    </View>
  );
}
