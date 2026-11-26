import { Text as RNText } from 'react-native';
import { colors, fonts } from '../styles/theme';

const variants = {
  display: { fontFamily: fonts.display, fontSize: 52, lineHeight: 58, letterSpacing: -0.8, color: colors.forest, fontWeight: '400' },
  title: { fontFamily: fonts.display, fontSize: 34, lineHeight: 41, letterSpacing: -0.4, color: colors.forest, fontWeight: '400' },
  heading: { fontFamily: fonts.display, fontSize: 24, lineHeight: 31, color: colors.forest, fontWeight: '400' },
  subheading: { fontFamily: fonts.body, fontSize: 17, lineHeight: 24, fontWeight: '700', color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 26, color: colors.ink },
  small: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.muted },
  caption: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.muted, fontWeight: '600' },
};

/** Texto com a tipografia do Receita Fácil. Use `variant` em vez de repetir estilos. */
export default function Text({ variant = 'body', style, ...props }) {
  return <RNText {...props} style={[variants[variant], style]} />;
}
