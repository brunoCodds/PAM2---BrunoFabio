import { useEffect, useMemo, useState } from 'react';
import { fetchNeighborhoods } from '../services/recommendationService';
import { rank } from '../utils/scoring';
export function useRecommendations(prefs, weights) {
  const [data, setData] = useState(null);
  useEffect(() => { let on = true; fetchNeighborhoods().then((d) => on && setData(d)); return () => { on = false; }; }, []);
  const ranked = useMemo(() => (data ? rank(data, prefs, weights) : []), [data, prefs, weights]);
  return { ranked, loading: !data };
}
