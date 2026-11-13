import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { usePreferencesContext } from '@/features/profile/PreferencesProvider';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { scheduleActivityReminder, syncActivityReminders } from '@/lib/notifications';
import { isPastDate } from './dateUtils';
import type { Activity, Category } from './types';

export function useActivitiesByDate(date: string) {
  const { preferences } = usePreferencesContext();
  const notificationsEnabled = preferences?.notificationsEnabled ?? true;
  const [categories, setCategories] = useState<Category[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setIsLoading(true);
    setError(null);
    try {
      const [categoriesData, activitiesData] = await Promise.all([
        api.get<Category[]>('/categories'),
        api.get<Activity[]>(`/activities?date=${date}`),
      ]);
      if (currentRequest !== requestId.current) return;
      setCategories(categoriesData);
      setActivities(activitiesData);
      syncActivityReminders(activitiesData, notificationsEnabled).catch(() => {});
    } catch (err) {
      if (currentRequest === requestId.current) {
        setError(getErrorMessage(err, 'No se pudo conectar con el servidor.'));
      }
    } finally {
      if (currentRequest === requestId.current) {
        setIsLoading(false);
      }
    }
  }, [date, notificationsEnabled]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleComplete(activity: Activity) {
    if (isPastDate(activity.scheduledDate)) {
      Alert.alert(
        'Actividad pasada',
        'No se pueden marcar ni modificar actividades de fechas pasadas. Puedes reprogramarla para hoy o una fecha futura.',
      );
      return;
    }

    try {
      const updated = activity.completedAt
        ? await api.patch<Activity>(`/activities/${activity.id}/uncomplete`)
        : await api.patch<Activity>(`/activities/${activity.id}/complete`);
      setActivities((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      scheduleActivityReminder(updated, notificationsEnabled).catch(() => {});
    } catch (err) {
      Alert.alert('No se pudo actualizar', getErrorMessage(err, 'Inténtalo de nuevo.'));
    }
  }

  return { categories, activities, isLoading, error, reload: load, toggleComplete };
}
