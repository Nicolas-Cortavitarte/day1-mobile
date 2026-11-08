import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { WeightUnit, WorkoutSessionDetail } from './types';

export function useWorkoutSession(activityId: string) {
  const [session, setSession] = useState<WorkoutSessionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(
    async (silent = false) => {
      const currentRequest = ++requestId.current;
      if (!silent) {
        setIsLoading(true);
        setError(null);
      }
      try {
        const data = await api.get<WorkoutSessionDetail>(`/activities/${activityId}/workout`);
        if (currentRequest !== requestId.current) return;
        setSession(data);
        setError(null);
      } catch (err) {
        if (currentRequest === requestId.current && !silent) {
          setError(getErrorMessage(err, 'No se pudo cargar la sesión.'));
        }
      } finally {
        if (currentRequest === requestId.current) setIsLoading(false);
      }
    },
    [activityId],
  );

  useEffect(() => {
    load();
  }, [load]);

  const reload = useCallback(() => load(false), [load]);

  async function addExercise(exerciseId: string, notes?: string) {
    await api.post(`/activities/${activityId}/workout/exercises`, {
      exerciseId,
      notes: notes || undefined,
    });
    await load(true);
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
    await load(true);
  }

  return { session, isLoading, error, reload, addExercise, logSet };
}
