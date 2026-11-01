import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';
import type { WeightUnit, WorkoutSessionDetail } from './types';

export function useWorkoutSession(activityId: string) {
  const [session, setSession] = useState<WorkoutSessionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setSession(await api.get<WorkoutSessionDetail>(`/activities/${activityId}/workout`));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar la sesión.');
    } finally {
      setIsLoading(false);
    }
  }, [activityId]);

  useEffect(() => {
    load();
  }, [load]);

  async function addExercise(exerciseId: string, notes?: string) {
    await api.post(`/activities/${activityId}/workout/exercises`, {
      exerciseId,
      notes: notes || undefined,
    });
    await load();
  }

  async function logSet(
    sessionExerciseId: string,
    data: {
      reps?: number;
      weightValue?: number;
      weightUnit?: WeightUnit;
      durationSeconds?: number;
      completed?: boolean;
    },
  ) {
    await api.post(`/workout-exercises/${sessionExerciseId}/sets`, data);
    await load();
  }

  return { session, isLoading, error, reload: load, addExercise, logSet };
}