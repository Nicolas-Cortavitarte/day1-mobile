import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';
import { todayISODate } from './dateUtils';
import type { ActivityStats } from './types';

export function useActivityStats() {
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setStats(await api.get<ActivityStats>(`/activities/stats?today=${todayISODate()}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las estadísticas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, isLoading, error, reload: load };
}