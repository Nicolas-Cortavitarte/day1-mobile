import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';
import type { Activity, Category } from './types';

function todayISODate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useTodayActivities() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const date = todayISODate();
      const [categoriesData, activitiesData] = await Promise.all([
        api.get<Category[]>('/categories'),
        api.get<Activity[]>(`/activities?date=${date}`),
      ]);
      setCategories(categoriesData);
      setActivities(activitiesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleComplete(activity: Activity) {
    const updated = activity.completedAt
      ? await api.patch<Activity>(`/activities/${activity.id}/uncomplete`)
      : await api.patch<Activity>(`/activities/${activity.id}/complete`);
    setActivities((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  }

  return { categories, activities, isLoading, error, reload: load, toggleComplete };
}