export type Category = {
  id: number;
  key: string | null;
  userId: string | null;
  name: string;
  color: string;
  sortOrder: number;
};

export type Activity = {
  id: string;
  userId: string;
  categoryId: number;
  title: string;
  description: string | null;
  scheduledDate: string;
  startTime: string | null;
  durationMinutes: number | null;
  reminderMinutes: number | null;
  recurrenceId: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ActivityRecurrence = {
  id: string;
  userId: string;
  categoryId: number;
  title: string;
  description: string | null;
  startTime: string | null;
  durationMinutes: number | null;
  reminderMinutes: number | null;
  frequency: 'DAILY' | 'WEEKLY';
  intervalCount: number;
  daysOfWeek: number[];
  startDate: string;
  endDate: string | null;
  generatedUntil: string;
};

export type CategoryStat = {
  categoryId: number;
  categoryName: string;
  completed: number;
  total: number;
};

export type ActivityStats = {
  totalCompleted: number;
  totalScheduled: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  byCategory: CategoryStat[];
};
