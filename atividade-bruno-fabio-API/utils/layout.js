import { useWindowDimensions } from 'react-native';

export const MAX_WIDTH = 1180;

/** Breakpoints simples usados em todo o app. */
export function useLayout() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isDesktop = width >= 960;
  const gutter = isMobile ? 20 : 32;
  return { width, isMobile, isDesktop, gutter };
}
