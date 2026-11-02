import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1ProgressBar } from '@/components/molecules/Day1ProgressBar';
import { Spacing, Radius } from '@/constants/theme';
import { longDateLabel } from '@/features/activities/dateUtils';
import { useActivityStats } from '@/features/activities/useActivityStats';
import { MILESTONES, nextMilestone, progressToNextMilestone, reachedMilestones } from '@/features/activities/milestones';
import { useExercises } from '@/features/workouts/useExercises';
import { useWorkoutHistory } from '@/features/workouts/useWorkoutHistory';
import { useTheme } from '@/hooks/use-theme';
import type { MainTabScreenProps } from '@/app/navigation-types';

type Props = MainTabScreenProps<'Progreso'>;

export function ProgresoScreen({ navigation }: Props) {
  const colors = useTheme();
  const { stats, isLoading: loadingStats, error: statsError, reload: reloadStats } = useActivityStats();
  const { history, isLoading: loadingHistory, error: historyError, reload: reloadHistory } = useWorkoutHistory();
  const { exercises } = useExercises();

  useFocusEffect(
    useCallback(() => {
      reloadStats();
      reloadHistory();
    }, [reloadStats, reloadHistory]),
  );

  const reached = stats ? reachedMilestones(stats.totalCompleted) : [];
  const next = stats ? nextMilestone(stats.totalCompleted) : null;
  const milestoneProgress = stats ? progressToNextMilestone(stats.totalCompleted) : 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Day1Text variant="heading26">Progreso</Day1Text>

        <Day1Text variant="bodySemiBold16">Estadísticas</Day1Text>

        {statsError ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>
            {statsError}
          </Day1Text>
        ) : loadingStats || !stats ? (
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
            Cargando estadísticas...
          </Day1Text>
        ) : (
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
              <Day1Text variant="heading26">{stats.currentStreak}</Day1Text>
              <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                Racha actual
              </Day1Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
              <Day1Text variant="heading26">{stats.longestStreak}</Day1Text>
              <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                Racha más larga
              </Day1Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
              <Day1Text variant="heading26">{stats.completionRate}%</Day1Text>
              <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                Cumplimiento
              </Day1Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
              <Day1Text variant="heading26">{stats.totalCompleted}</Day1Text>
              <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                Completadas
              </Day1Text>
            </View>

            {stats.byCategory.map((category) => (
              <View key={category.categoryId} style={styles.categoryRow}>
                <Day1Text variant="labelMedium14">{category.categoryName}</Day1Text>
                <Day1ProgressBar percent={category.total > 0 ? (category.completed / category.total) * 100 : 0} />
                <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                  {category.completed}/{category.total}
                </Day1Text>
              </View>
            ))}
          </View>
        )}

        <Day1Text variant="bodySemiBold16" style={styles.sectionSpacing}>
          Mi camino
        </Day1Text>

        {stats ? (
          <View style={styles.milestoneBox}>
            <Day1ProgressBar percent={milestoneProgress} />
            <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
              {next
                ? `${stats.totalCompleted}/${next} actividades completadas para el próximo hito`
                : `¡Superaste los ${MILESTONES[MILESTONES.length - 1]} hitos! 🎉`}
            </Day1Text>
            <View style={styles.badgeRow}>
              {MILESTONES.map((milestone) => (
                <View
                  key={milestone}
                  style={[
                    styles.badge,
                    {
                      backgroundColor: reached.includes(milestone) ? colors.surfaceBrandSoft : colors.surfaceDisabled,
                      borderColor: reached.includes(milestone) ? colors.actionPrimary : colors.borderSubtle,
                    },
                  ]}
                >
                  <Day1Text variant="labelMedium14">{milestone}</Day1Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <Day1Text variant="bodySemiBold16" style={styles.sectionSpacing}>
          Historial de sesiones
        </Day1Text>

        {historyError ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>
            {historyError}
          </Day1Text>
        ) : loadingHistory ? (
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
            Cargando historial...
          </Day1Text>
        ) : history.length === 0 ? (
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
            Aún no registras sesiones de gimnasio.
          </Day1Text>
        ) : (
          history.map((entry) => (
            <View key={entry.sessionId} style={[styles.card, { borderColor: colors.borderSubtle }]}>
              <Day1Button
                label={`${entry.activityTitle} — ${longDateLabel(entry.scheduledDate)}`}
                variant="secondary"
                onPress={() =>
                  navigation.navigate('WorkoutSession', {
                    activityId: entry.activityId,
                    activityTitle: entry.activityTitle,
                  })
                }
              />
              <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                {entry.exerciseCount} ejercicios · {entry.setCount} series
              </Day1Text>
            </View>
          ))
        )}

        <Day1Text variant="bodySemiBold16" style={styles.sectionSpacing}>
          Evolución por ejercicio
        </Day1Text>

        {exercises.map((exercise) => (
          <Day1Button
            key={exercise.id}
            label={exercise.name}
            variant="ghost"
            onPress={() => navigation.navigate('ExerciseProgress', { exerciseId: exercise.id, exerciseName: exercise.name })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[16], gap: Spacing[8] },
  card: { gap: Spacing[4], paddingBottom: Spacing[8], borderBottomWidth: 1 },
  sectionSpacing: { marginTop: Spacing[16] },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[8] },
  statCard: { width: '47%', padding: Spacing[12], borderRadius: Radius[14], borderWidth: 1, gap: Spacing[4] },
  categoryRow: { width: '100%', gap: Spacing[4], marginTop: Spacing[4] },
  milestoneBox: { gap: Spacing[8] },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[8] },
  badge: { paddingHorizontal: Spacing[12], paddingVertical: Spacing[6], borderRadius: Radius[20], borderWidth: 1 },
});