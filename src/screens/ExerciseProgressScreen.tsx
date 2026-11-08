import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ANIMATIONS } from '@/assets/animations';
import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Lottie } from '@/components/atoms/Day1Lottie';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1ErrorState } from '@/components/molecules/Day1ErrorState';
import { Day1ProgressBar } from '@/components/molecules/Day1ProgressBar';
import { Radius, Spacing } from '@/constants/theme';
import { longDateLabel } from '@/features/activities/dateUtils';
import { useExerciseProgress } from '@/features/workouts/useExerciseProgress';
import { useTheme } from '@/hooks/use-theme';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseProgress'>;

export function ExerciseProgressScreen({ route, navigation }: Props) {
  const colors = useTheme();
  const { exerciseId, exerciseName } = route.params;
  const { progress, isLoading, error, reload } = useExerciseProgress(exerciseId);

  const maxWeight = Math.max(0, ...progress.map((p) => p.bestWeightValue ?? 0));
  const maxReps = Math.max(0, ...progress.map((p) => p.reps ?? 0));
  const useWeightBar = maxWeight > 0;

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

        <Day1Text variant="heading26">{exerciseName}</Day1Text>

        {error ? (
          <Day1ErrorState message={error} onRetry={reload} compact />
        ) : isLoading && progress.length === 0 ? (
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
            Cargando progreso...
          </Day1Text>
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
              const barBasis = useWeightBar ? maxWeight : maxReps;
              const barValue = useWeightBar ? (point.bestWeightValue ?? 0) : (point.reps ?? 0);
              const barPercent = barBasis > 0 ? (barValue / barBasis) * 100 : 0;

              const valueLabel = useWeightBar
                ? `${point.bestWeightValue ?? 0} ${point.weightUnit ?? ''}`.trim()
                : `${point.reps ?? 0} reps`;

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
  card: { padding: Spacing[16], borderRadius: Radius[16], borderWidth: 1, gap: Spacing[14] },
  row: { gap: Spacing[6] },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  emptyBox: { alignItems: 'center', gap: Spacing[12], paddingVertical: Spacing[32] },
  center: { textAlign: 'center' },
  date: { textTransform: 'capitalize' },
});
