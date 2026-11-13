import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ANIMATIONS } from '@/assets/animations';
import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1ExerciseThumbnail } from '@/components/atoms/Day1ExerciseThumbnail';
import { Day1Lottie } from '@/components/atoms/Day1Lottie';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1ErrorState } from '@/components/molecules/Day1ErrorState';
import { Day1ProgressBar } from '@/components/molecules/Day1ProgressBar';
import { Day1SkeletonCardList } from '@/components/molecules/Day1SkeletonGroup';
import { Radius, Spacing } from '@/constants/theme';
import { longDateLabel } from '@/features/activities/dateUtils';
import { useExerciseProgress } from '@/features/workouts/useExerciseProgress';
import { useTheme } from '@/hooks/use-theme';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseProgress'>;

const LB_TO_KG = 0.45359237;

function weightInKg(value: number | null, unit: 'KG' | 'LB' | null): number {
  if (value == null) return 0;
  return unit === 'LB' ? value * LB_TO_KG : value;
}

export function ExerciseProgressScreen({ route, navigation }: Props) {
  const colors = useTheme();
  const { exerciseId, exerciseName } = route.params;
  const { progress, isLoading, error, reload } = useExerciseProgress(exerciseId);

  const maxWeightKg = Math.max(0, ...progress.map((p) => weightInKg(p.bestWeightValue, p.weightUnit)));
  const maxReps = Math.max(0, ...progress.map((p) => p.reps ?? 0));
  const maxDuration = Math.max(0, ...progress.map((p) => p.durationSeconds ?? 0));
  const metric: 'weight' | 'reps' | 'duration' =
    maxWeightKg > 0 ? 'weight' : maxReps > 0 ? 'reps' : 'duration';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && progress.length > 0}
            onRefresh={reload}
            tintColor={colors.actionPrimary}
          />
        }>
        <View style={styles.header}>
          <Day1Button label="Volver" icon="arrowLeft" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <View style={styles.titleRow}>
          <Day1ExerciseThumbnail exerciseName={exerciseName} size={48} />
          <Day1Text variant="heading26" style={styles.flex}>
            {exerciseName}
          </Day1Text>
        </View>

        {error ? (
          <Day1ErrorState message={error} onRetry={reload} compact />
        ) : isLoading && progress.length === 0 ? (
          <Day1SkeletonCardList count={3} variant="simple" />
        ) : progress.length === 0 ? (
          <View style={styles.emptyBox}>
            <Day1Lottie source={ANIMATIONS.emptyCalm} size={96} />
            <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable} style={styles.center}>
              Aún no tienes series registradas de este ejercicio.
            </Day1Text>
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
            {[...progress].reverse().map((point) => {
              const barBasis =
                metric === 'weight' ? maxWeightKg : metric === 'reps' ? maxReps : maxDuration;
              const barValue =
                metric === 'weight'
                  ? weightInKg(point.bestWeightValue, point.weightUnit)
                  : metric === 'reps'
                    ? (point.reps ?? 0)
                    : (point.durationSeconds ?? 0);
              const barPercent = barBasis > 0 ? (barValue / barBasis) * 100 : 0;

              const valueLabel =
                metric === 'weight'
                  ? `${point.bestWeightValue ?? 0} ${point.weightUnit ?? ''}`.trim()
                  : metric === 'reps'
                    ? `${point.reps ?? 0} reps`
                    : `${point.durationSeconds ?? 0} s`;

              return (
                <View key={point.sessionId} style={styles.row}>
                  <View style={styles.rowHeader}>
                    <Day1Text variant="labelMedium14" color={colors.textSecondaryReadable} style={styles.date}>
                      {longDateLabel(point.date)}
                    </Day1Text>
                    <Day1Text variant="labelSemiBold14">{valueLabel}</Day1Text>
                  </View>
                  <Day1ProgressBar percent={barPercent} />
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[20], gap: Spacing[16], paddingBottom: Spacing[40] },
  header: { flexDirection: 'row' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[12] },
  flex: { flex: 1 },
  card: { padding: Spacing[16], borderRadius: Radius[16], borderWidth: 1, gap: Spacing[14] },
  row: { gap: Spacing[6] },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  emptyBox: { alignItems: 'center', gap: Spacing[12], paddingVertical: Spacing[32] },
  center: { textAlign: 'center' },
  date: { textTransform: 'capitalize' },
});
