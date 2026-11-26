import { useCallback, useEffect, useState } from 'react';

const LOADING = { status: 'loading', data: null, error: null };

/**
 * Executa uma função assíncrona e expõe { status, data, error, reload }.
 * Resultados de requisições antigas (já substituídas) são ignorados.
 */
export function useAsync(fn, deps) {
  const [state, setState] = useState(LOADING);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((current) => (current.status === 'loading' ? current : LOADING));

    Promise.resolve()
      .then(fn)
      .then(
        (data) => {
          if (!cancelled) setState({ status: 'success', data, error: null });
        },
        (error) => {
          if (!cancelled) setState({ status: 'error', data: null, error });
        }
      );

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}
