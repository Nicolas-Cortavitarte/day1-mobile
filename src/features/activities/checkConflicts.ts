import { api } from '@/lib/api';
import type { Activity } from './types';

export async function checkActivityConflicts(params: {
  date: string;
  startTime: string;
  durationMinutes: number;
  excludeActivityId?: string;
}): Promise<Activity[]> {
  const query = new URLSearchParams({
    date: params.date,
    startTime: params.startTime,
    durationMinutes: String(params.durationMinutes),
    ...(params.excludeActivityId ? { excludeActivityId: params.excludeActivityId } : {}),
  });

  return api.get<Activity[]>(`/activities/conflicts?${query.toString()}`);
}