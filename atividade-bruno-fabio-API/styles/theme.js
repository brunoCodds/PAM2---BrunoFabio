import { Platform } from 'react-native';

export const colors = {
  cream: '#FBF8F0',
  paper: '#FFFFFF',
  forest: '#16402F',
  forestDark: '#0F2E22',
  sage: '#DCE8D0',
  sageLight: '#EEF4E6',
  orange: '#E98A2F',
  orangeSoft: '#FCEBD6',
  ink: '#1B2A22',
  muted: '#5F7066',
  line: '#E4E0D2',
  danger: '#A8391B',
};

export const fonts = {
  display: Platform.select({
    web: "'Young Serif', Georgia, 'Times New Roman', serif",
    default: undefined,
  }),
  body: Platform.select({
    web: "'Figtree', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    default: undefined,
  }),
};

export const radius = { sm: 12, md: 20, lg: 28, pill: 999 };

export const shadows = {
  soft: { boxShadow: '0 10px 30px rgba(22, 64, 47, 0.10)' },
  lift: { boxShadow: '0 4px 14px rgba(22, 64, 47, 0.16)' },
};

// Aplica estilos que só existem na web (cursor, transições) sem avisos no nativo.
export const web = (style) => (Platform.OS === 'web' ? style : null);
