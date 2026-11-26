import { useCallback, useEffect, useRef, useState } from 'react';

// Navegação mínima baseada em hash (#/receita/52772). Na web isso dá botão
// "voltar" do navegador, links compartilháveis e F5 sem perder a tela.

export const HOME = { name: 'home' };

const hasWindow =
  typeof window !== 'undefined' && !!window.history && !!window.location && !!window.addEventListener;

const safeDecode = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export function parseRoute(hash) {
  const parts = (hash || '').replace(/^#\/?/, '').split('/');
  const [page, a, ...rest] = parts;
  switch (page) {
    case 'busca':
      return {
        name: 'search',
        mode: a === 'ingredient' ? 'ingredient' : 'name',
        q: safeDecode(rest.join('/')),
      };
    case 'categorias':
      return { name: 'categories' };
    case 'categoria':
      return a ? { name: 'category', category: safeDecode(a) } : { name: 'categories' };
    case 'receita':
      return a ? { name: 'recipe', id: safeDecode(a) } : HOME;
    case 'favoritos':
      return { name: 'favorites' };
    default:
      return HOME;
  }
}

export function routeToHash(route) {
  switch (route.name) {
    case 'search':
      return `#/busca/${route.mode}/${encodeURIComponent(route.q)}`;
    case 'categories':
      return '#/categorias';
    case 'category':
      return `#/categoria/${encodeURIComponent(route.category)}`;
    case 'recipe':
      return `#/receita/${encodeURIComponent(route.id)}`;
    case 'favorites':
      return '#/favoritos';
    default:
      return '#/';
  }
}

export function useRouter() {
  const [route, setRoute] = useState(() => (hasWindow ? parseRoute(window.location.hash) : HOME));
  const stack = useRef([]); // histórico próprio, usado fora da web

  useEffect(() => {
    if (!hasWindow) return undefined;
    if (window.history.state == null) {
      window.history.replaceState({ idx: 0 }, '', window.location.href);
    }
    const onPop = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((next) => {
    if (hasWindow) {
      const idx = (window.history.state && window.history.state.idx) || 0;
      window.history.pushState({ idx: idx + 1 }, '', routeToHash(next));
    } else {
      stack.current.push(next);
    }
    setRoute(next);
  }, []);

  const back = useCallback(() => {
    if (hasWindow) {
      const idx = (window.history.state && window.history.state.idx) || 0;
      if (idx > 0) window.history.back();
      else navigate(HOME);
    } else {
      stack.current.pop();
      setRoute(stack.current[stack.current.length - 1] || HOME);
    }
  }, [navigate]);

  return { route, navigate, back };
}
