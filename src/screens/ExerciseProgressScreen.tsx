import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Spacing, Radius } from '@/constants/theme';
import { longDateLabel } from '@/features/activities/dateUtils';
import { useExerciseProgress } from '@/features/workouts/useExerciseProgress';
import { useTheme } from '@/hooks/use-theme';
import type { RootStackParamList } from '@/app/navigation-types';
import { Day1ProgressBar } from '@/components/molecules/Day1ProgressBar';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseProgress'>;

export function ExerciseProgressScreen({ route, navigation }: Props) {
  const colors = useTheme();
  const { exerciseId, exerciseName } = route.params;
  const { progress, isLoading, error } = useExerciseProgress(exerciseId);

  const maxWeight = Math.max(0, ...progress.map((p) => p.bestWeightValue ?? 0));
  const maxReps = Math.max(0, ...progress.map((p) => p.reps ?? 0));
  const useWeightBar = maxWeight > 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Day1Button label="Volver" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <Day1Text variant="heading26">{exerciseName}</Day1Text>

        {error ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>
            {error}
          </Day1Text>
        ) : isLoading ? (
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
            Cargando progreso...
          </Day1Text>
        ) : progress.length === 0 ? (
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
            Aún no tienes series registradas de este ejercicio.
          </Day1Text>
        ) : (
          [...progress].reverse().map((point) => {
            const barBasis = useWeightBar ? maxWeight : maxReps;
            const barValue = useWeightBar ? (point.bestWeightValue ?? 0) : (point.reps ?? 0);
            const barPercent = barBasis > 0 ? (barValue / barBasis) * 100 : 0;

            const valueLabel = useWeightBar
              ? `${point.bestWeightValue ?? 0} ${point.weightUnit ?? ''}`.trim()
              : `${point.reps ?? 0} reps`;

            return (
              <View key={point.sessionId} style={styles.row}>
                <Day1Text variant="labelMedium14" color={colors.textSecondaryReadable} style={styles.date}>
                  {longDateLabel(point.date)}
                </Day1Text>
                <Day1ProgressBar percent={barPercent} />
                <Day1Text variant="labelSemiBold14">{valueLabel}</Day1Text>
              </View>
            );
          })
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, padding: Spacing[16], gap: Spacing[12] },
  header: { flexDirection: 'row' },
  row: { gap: Spacing[4] },
  date: { textTransform: 'capitalize' },
});