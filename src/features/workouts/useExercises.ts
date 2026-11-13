import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { Exercise } from './types';

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<Exercise[]>('/exercises');
      if (currentRequest !== requestId.current) return;
      setExercises(data);
    } catch (err) {
      if (currentRequest === requestId.current) {
        setError(getErrorMessage(err, 'No se pudieron cargar los ejercicios.'));
      }
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createExercise(name: string, muscleGroup?: string) {
    const exercise = await api.post<Exercise>('/exercises', {
      name,
      muscleGroup: muscleGroup || undefined,
    });
    setExercises((prev) => [...prev, exercise].sort((a, b) => a.name.localeCompare(b.name)));
    return exercise;
  }

  async function updateExercise(
    id: string,
    payload: { name?: string; muscleGroup?: string | null },
  ) {
    const updated = await api.patch<Exercise>(`/exercises/${id}`, payload);
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? updated : e)).sort((a, b) => a.name.localeCompare(b.name)),
    );
    return updated;
  }

  async function deleteExercise(id: string) {
    await api.delete(`/exercises/${id}`);
    setExercises((prev) => prev.filter((e) => e.id !== id));
  }

  return {
    exercises,
    isLoading,
    error,
    createExercise,
    updateExercise,
    deleteExercise,
    reload: load,
  };
}
