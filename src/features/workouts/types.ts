export type Exercise = {
  id: string;
  userId: string | null;
  name: string;
  muscleGroup: string | null;
};

export type WeightUnit = 'KG' | 'LB';

export type WorkoutSet = {
  id: string;
  setNumber: number;
  reps: number | null;
  weightValue: number | null;
  weightUnit: WeightUnit | null;
  durationSeconds: number | null;
  completedAt: string | null;
};

export type WorkoutSessionExercise = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  position: number;
  notes: string | null;
  sets: WorkoutSet[];
};

export type WorkoutSessionDetail = {
  id: string;
  activityId: string;
  startedAt: string | null;
  endedAt: string | null;
  notes: string | null;
  exercises: WorkoutSessionExercise[];
};

export type WorkoutHistoryEntry = {
  sessionId: string;
  activityId: string;
  activityTitle: string;
  scheduledDate: string;
  exerciseCount: number;
  setCount: number;
};

export type ExerciseProgressPoint = {
  sessionId: string;
  date: string;
  bestWeightValue: number | null;
  weightUnit: WeightUnit | null;
  reps: number | null;
  durationSeconds: number | null;
};