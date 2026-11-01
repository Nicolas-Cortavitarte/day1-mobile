import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';
import type { WorkoutHistoryEntry } from './types';

export function useWorkoutHistory() {
  const [history, setHistory] = useState<WorkoutHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setHistory(await api.get<WorkoutHistoryEntry[]>('/workouts/history'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el historial.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { history, isLoading, error, reload: load };
}