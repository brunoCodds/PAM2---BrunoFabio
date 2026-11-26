import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const KEY = 'receita-facil:favorites:v1';

function getStorage() {
  try {
    return typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
  } catch {
    // Acesso ao localStorage pode lançar (modo privado, cookies bloqueados).
    return null;
  }
}

export function loadFavorites() {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const data = JSON.parse(storage.getItem(KEY) || '[]');
    if (!Array.isArray(data)) return [];
    return data.filter((f) => f && typeof f.id === 'string' && typeof f.name === 'string');
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  try {
    getStorage()?.setItem(KEY, JSON.stringify(list));
  } catch {
    // Sem espaço ou sem permissão: o app segue funcionando só em memória.
  }
}

/** Favoritos persistidos em localStorage, sincronizados entre abas. */
export function useFavorites() {
  const [favorites, setFavorites] = useState(loadFavorites);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    saveFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.addEventListener) return undefined;
    const onStorage = (event) => {
      if (event.key === KEY || event.key === null) setFavorites(loadFavorites());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleFavorite = useCallback((meal) => {
    if (!meal || !meal.id) return;
    setFavorites((prev) => {
      if (prev.some((f) => f.id === meal.id)) return prev.filter((f) => f.id !== meal.id);
      const saved = {
        id: meal.id,
        name: meal.name,
        thumb: meal.thumb || '',
        category: meal.category || '',
        area: meal.area || '',
      };
      return [saved, ...prev];
    });
  }, []);

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  return { favorites, favoriteIds, toggleFavorite };
}
