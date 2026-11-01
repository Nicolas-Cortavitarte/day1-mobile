import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';
import type { ExerciseProgressPoint } from './types';

export function useExerciseProgress(exerciseId: string) {
  const [progress, setProgress] = useState<ExerciseProgressPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setProgress(await api.get<ExerciseProgressPoint[]>(`/exercises/${exerciseId}/progress`));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar la progresión.');
    } finally {
      setIsLoading(false);
    }
  }, [exerciseId]);

  useEffect(() => {
    load();
  }, [load]);

  return { progress, isLoading, error, reload: load };
}