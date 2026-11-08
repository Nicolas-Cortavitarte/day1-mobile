import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { todayISODate } from './dateUtils';
import type { ActivityStats } from './types';

export function useActivityStats() {
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<ActivityStats>(`/activities/stats?today=${todayISODate()}`);
      if (currentRequest !== requestId.current) return;
      setStats(data);
    } catch (err) {
      if (currentRequest === requestId.current) {
        setError(getErrorMessage(err, 'No se pudieron cargar las estadísticas.'));
      }
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, isLoading, error, reload: load };
}
