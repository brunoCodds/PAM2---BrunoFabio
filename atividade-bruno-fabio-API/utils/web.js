import { Platform } from 'react-native';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Young+Serif&display=swap';

const CSS = `
  html, body { background: #FBF8F0; }
  body { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
  [tabindex]:focus-visible { outline: 3px solid #E98A2F; outline-offset: 2px; }
  ::selection { background: #DCE8D0; }
  @media (prefers-reduced-motion: reduce) {
    * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
  }
`;

const isWeb = Platform.OS === 'web' && typeof document !== 'undefined';

/** Fontes, idioma e estilos globais da página (só na web). */
export function setupWeb() {
  if (!isWeb || document.getElementById('rf-setup')) return;

  document.documentElement.lang = 'pt-BR';

  const marker = document.createElement('meta');
  marker.id = 'rf-setup';
  document.head.appendChild(marker);

  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://fonts.gstatic.com';
  preconnect.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect);

  const fonts = document.createElement('link');
  fonts.rel = 'stylesheet';
  fonts.href = FONT_URL;
  document.head.appendChild(fonts);

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);
}

export function setTitle(title) {
  if (isWeb) document.title = title;
}
