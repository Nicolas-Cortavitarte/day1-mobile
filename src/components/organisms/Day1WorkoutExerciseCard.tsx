import { StyleSheet, View } from 'react-native';

import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1SetForm } from '@/components/molecules/Day1SetForm';
import { Day1SetRow } from '@/components/molecules/Day1SetRow';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
import type { WeightUnit, WorkoutSessionExercise } from '@/features/workouts/types';

type Props = {
  exercise: WorkoutSessionExercise;
  onLogSet: (data: {
    reps?: number;
    weightValue?: number;
    weightUnit?: WeightUnit;
    durationSeconds?: number;
    completed?: boolean;
  }) => Promise<void>;
};

export function Day1WorkoutExerciseCard({ exercise, onLogSet }: Props) {
  const colors = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
      <Day1Text variant="bodySemiBold16">{exercise.exerciseName}</Day1Text>

      {exercise.sets.length === 0 ? (
        <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
          Sin series todavía.
        </Day1Text>
      ) : (
        exercise.sets.map((set) => <Day1SetRow key={set.id} set={set} />)
      )}

      <Day1SetForm onSubmit={onLogSet} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: Spacing[16], borderRadius: Radius[16], borderWidth: 1, gap: Spacing[4] },
});