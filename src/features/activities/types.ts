export type Category = {
  id: number;
  key: string;
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
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
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