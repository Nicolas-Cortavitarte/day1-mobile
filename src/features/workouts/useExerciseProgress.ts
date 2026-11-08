import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { ExerciseProgressPoint } from './types';

export function useExerciseProgress(exerciseId: string) {
  const [progress, setProgress] = useState<ExerciseProgressPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<ExerciseProgressPoint[]>(`/exercises/${exerciseId}/progress`);
      if (currentRequest !== requestId.current) return;
      setProgress(data);
    } catch (err) {
      if (currentRequest === requestId.current) {
        setError(getErrorMessage(err, 'No se pudo cargar la progresión.'));
      }
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  }, [exerciseId]);

  useEffect(() => {
    load();
  }, [load]);

  return { progress, isLoading, error, reload: load };
}
