import { StyleSheet, View } from 'react-native';

import { Day1ExerciseThumbnail } from '@/components/atoms/Day1ExerciseThumbnail';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1SetForm } from '@/components/molecules/Day1SetForm';
import { Day1SetRow } from '@/components/molecules/Day1SetRow';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
import type { SetPayload } from '@/features/workouts/setValidation';
import type { WorkoutSessionExercise } from '@/features/workouts/types';

type Props = {
  exercise: WorkoutSessionExercise;
  muscleGroup?: string | null;
  onLogSet: (data: SetPayload) => Promise<void>;
};

export function Day1WorkoutExerciseCard({ exercise, muscleGroup, onLogSet }: Props) {
  const colors = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
      <View style={styles.headerRow}>
        <Day1ExerciseThumbnail
          muscleGroup={muscleGroup}
          exerciseName={exercise.exerciseName}
          size={44}
        />
        <View style={styles.headerTexts}>
          <Day1Text variant="bodySemiBold16">{exercise.exerciseName}</Day1Text>
          <Day1Text variant="labelRegular12" color={colors.textSecondaryReadable}>
            {muscleGroup || 'Ejercicio de fuerza'} · {exercise.sets.length}{' '}
            {exercise.sets.length === 1 ? 'serie' : 'series'}
          </Day1Text>
        </View>
      </View>

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
  card: { padding: Spacing[16], borderRadius: Radius[16], borderWidth: 1, gap: Spacing[8] },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[12], marginBottom: Spacing[4] },
  headerTexts: { flex: 1, gap: 2 },
});
