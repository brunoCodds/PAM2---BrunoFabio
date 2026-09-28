import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { DEFAULT_WEIGHTS } from '../utils/scoring';
const initial = { workplace: 'Avenida Paulista, São Paulo', budget: 3500, maxCommute: 40, mode: 'transit', weights: DEFAULT_WEIGHTS };
const Ctx = createContext(null);
export function AppProvider({ children }) {
  const [prefs, setPrefs] = useState(initial);
  const [compare, setCompare] = useState([]);
  const toggleCompare = useCallback((id) => setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length < 3 ? [...c, id] : c)), []);
  const reset = useCallback(() => { setPrefs(initial); setCompare([]); }, []);
  const value = useMemo(() => ({ prefs, setPrefs, compare, toggleCompare, reset }), [prefs, compare, toggleCompare, reset]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useApp = () => useContext(Ctx);
