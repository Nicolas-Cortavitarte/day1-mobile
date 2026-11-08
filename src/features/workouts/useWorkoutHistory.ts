import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { WorkoutHistoryEntry } from './types';

export function useWorkoutHistory() {
  const [history, setHistory] = useState<WorkoutHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<WorkoutHistoryEntry[]>('/workouts/history');
      if (currentRequest !== requestId.current) return;
      setHistory(data);
    } catch (err) {
      if (currentRequest === requestId.current) {
        setError(getErrorMessage(err, 'No se pudo cargar el historial.'));
      }
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { history, isLoading, error, reload: load };
}
