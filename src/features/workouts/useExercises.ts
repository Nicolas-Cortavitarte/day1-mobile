import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';
import type { Exercise } from './types';

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setExercises(await api.get<Exercise[]>('/exercises'));
    } finally {
      setIsLoading(false);
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

  return { exercises, isLoading, createExercise, reload: load };
}