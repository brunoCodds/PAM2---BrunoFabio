import { Pressable } from 'react-native';
import Text from './Text';
import { colors, web } from '../styles/theme';

export default function BackLink({ onPress, label = 'Voltar' }) {
  return (
    <Pressable onPress={onPress} role="button" style={[{ alignSelf: 'flex-start' }, web({ cursor: 'pointer' })]}>
      {({ hovered }) => (
        <Text
          variant="subheading"
          style={{ color: colors.forest, fontSize: 15, textDecorationLine: hovered ? 'underline' : 'none' }}
        >
          ‹ {label}
        </Text>
      )}
    </Pressable>
  );
}
