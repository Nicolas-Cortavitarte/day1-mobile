import { todayISODate } from './dateUtils';
import { useActivitiesByDate } from './useActivitiesByDate';

export function useTodayActivities(date: string = todayISODate()) {
  return useActivitiesByDate(date);
}
