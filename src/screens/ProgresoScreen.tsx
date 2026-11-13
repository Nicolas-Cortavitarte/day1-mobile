import { useCallback, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { ANIMATIONS } from '@/assets/animations';
import { Day1Button } from '@/components/atoms/Day1Button';
import {
  Day1ExerciseThumbnail,
  MUSCLE_GROUP_PRESETS,
  resolveMuscleGroupKey,
} from '@/components/atoms/Day1ExerciseThumbnail';
import { Day1Icon } from '@/components/atoms/Day1Icon';
import { Day1Lottie } from '@/components/atoms/Day1Lottie';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1ErrorState } from '@/components/molecules/Day1ErrorState';
import { Day1ProgressBar } from '@/components/molecules/Day1ProgressBar';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { Spacing, Radius } from '@/constants/theme';
import { longDateLabel } from '@/features/activities/dateUtils';
import { useActivityStats } from '@/features/activities/useActivityStats';
import {
  MILESTONES,
  nextMilestone,
  progressToNextMilestone,
  reachedMilestones,
} from '@/features/activities/milestones';
import { useExercises } from '@/features/workouts/useExercises';
import { useWorkoutHistory } from '@/features/workouts/useWorkoutHistory';
import { useTheme } from '@/hooks/use-theme';
import type { MainTabScreenProps } from '@/app/navigation-types';

type Props = MainTabScreenProps<'Progreso'>;

const INITIAL_EXERCISES_LIMIT = 5;

export function ProgresoScreen({ navigation }: Props) {
  const colors = useTheme();
  const { stats, isLoading: loadingStats, error: statsError, reload: reloadStats } =
    useActivityStats();
  const { history, isLoading: loadingHistory, error: historyError, reload: reloadHistory } =
    useWorkoutHistory();
  const { exercises, error: exercisesError, reload: reloadExercises } = useExercises();

  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string | null>(null);
  const [showAllExercises, setShowAllExercises] = useState(false);

  const reloadAll = useCallback(() => {
    reloadStats();
    reloadHistory();
    reloadExercises();
  }, [reloadStats, reloadHistory, reloadExercises]);

  useFocusEffect(
    useCallback(() => {
      reloadAll();
    }, [reloadAll]),
  );

  const isRefreshing =
    (loadingStats && !!stats) || (loadingHistory && history.length > 0);

  const reached = stats ? reachedMilestones(stats.totalCompleted) : [];
  const next = stats ? nextMilestone(stats.totalCompleted) : null;
  const milestoneProgress = stats ? progressToNextMilestone(stats.totalCompleted) : 0;

  const normalizedSearch = exerciseSearch.trim().toLowerCase();

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesText =
        !normalizedSearch ||
        exercise.name.toLowerCase().includes(normalizedSearch) ||
        (exercise.muscleGroup ?? '').toLowerCase().includes(normalizedSearch);

      const matchesGroup =
        !selectedGroupFilter ||
        resolveMuscleGroupKey(exercise.muscleGroup, exercise.name) === selectedGroupFilter;

      return matchesText && matchesGroup;
    });
  }, [exercises, normalizedSearch, selectedGroupFilter]);

  const isFiltering = normalizedSearch.length > 0 || selectedGroupFilter !== null;
  const visibleExercises =
    isFiltering || showAllExercises
      ? filteredExercises
      : filteredExercises.slice(0, INITIAL_EXERCISES_LIMIT);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={reloadAll}
            tintColor={colors.actionPrimary}
          />
        }>
        <Day1Text variant="heading26">Progreso</Day1Text>

        <View style={styles.section}>
          <Day1Text variant="bodySemiBold16">Estadísticas</Day1Text>

          {statsError && !stats ? (
            <Day1ErrorState message={statsError} onRetry={reloadStats} compact />
          ) : !stats ? (
            <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
              Cargando estadísticas...
            </Day1Text>
          ) : (
            <>
              <View style={styles.statsGrid}>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
                  ]}>
                  <Day1Text variant="heading26">{stats.currentStreak}</Day1Text>
                  <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                    Racha actual
                  </Day1Text>
                </View>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
                  ]}>
                  <Day1Text variant="heading26">{stats.longestStreak}</Day1Text>
                  <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                    Racha más larga
                  </Day1Text>
                </View>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
                  ]}>
                  <Day1Text variant="heading26">{stats.completionRate}%</Day1Text>
                  <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                    Cumplimiento
                  </Day1Text>
                </View>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
                  ]}>
                  <Day1Text variant="heading26">{stats.totalCompleted}</Day1Text>
                  <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                    Completadas
                  </Day1Text>
                </View>
              </View>

              {stats.byCategory.length > 0 ? (
                <View
                  style={[
                    styles.regionCard,
                    { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
                  ]}>
                  {stats.byCategory.map((category) => (
                    <View key={category.categoryId} style={styles.categoryRow}>
                      <View style={styles.categoryHeader}>
                        <Day1Text variant="labelMedium14">{category.categoryName}</Day1Text>
                        <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                          {category.completed}/{category.total}
                        </Day1Text>
                      </View>
                      <Day1ProgressBar
                        percent={
                          category.total > 0 ? (category.completed / category.total) * 100 : 0
                        }
                      />
                    </View>
                  ))}
                </View>
              ) : null}
            </>
          )}
        </View>

        {stats ? (
          <View style={styles.section}>
            <Day1Text variant="bodySemiBold16">Mi camino</Day1Text>

            <View
              style={[
                styles.regionCard,
                { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
              ]}>
              <View style={styles.milestoneHeroRow}>
                <View style={styles.milestoneAnimationBox}>
                  <Day1Lottie source={ANIMATIONS.milestone} size={76} loop />
                </View>
                <View style={styles.milestoneHeroTexts}>
                  <Day1Text variant="section20">
                    {stats.totalCompleted}{' '}
                    {stats.totalCompleted === 1 ? 'actividad' : 'actividades'}
                  </Day1Text>
                  <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                    {next
                      ? `${stats.totalCompleted}/${next} para tu próximo hito`
                      : `¡Superaste las ${MILESTONES[MILESTONES.length - 1]} actividades completadas!`}
                  </Day1Text>
                </View>
              </View>

              <Day1ProgressBar percent={milestoneProgress} />

              <View style={styles.badgeRow}>
                {MILESTONES.map((milestone) => (
                  <View
                    key={milestone}
                    style={[
                      styles.badge,
                      {
                        backgroundColor: reached.includes(milestone)
                          ? colors.surfaceBrandSoft
                          : colors.surfaceDisabled,
                        borderColor: reached.includes(milestone)
                          ? colors.actionPrimary
                          : colors.borderSubtle,
                      },
                    ]}>
                    <Day1Text
                      variant="labelMedium14"
                      color={
                        reached.includes(milestone)
                          ? colors.actionPressed
                          : colors.textSecondaryReadable
                      }>
                      {milestone}
                    </Day1Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Day1Text variant="bodySemiBold16">Historial de sesiones</Day1Text>

          {historyError && history.length === 0 ? (
            <Day1ErrorState message={historyError} onRetry={reloadHistory} compact />
          ) : loadingHistory && history.length === 0 ? (
            <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
              Cargando historial...
            </Day1Text>
          ) : history.length === 0 ? (
            <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
              Aún no registras sesiones de gimnasio.
            </Day1Text>
          ) : (
            <View
              style={[
                styles.listCard,
                { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
              ]}>
              {history.map((entry, index) => (
                <Pressable
                  key={entry.sessionId}
                  accessibilityRole="button"
                  accessibilityLabel={`${entry.activityTitle}, ${longDateLabel(entry.scheduledDate)}`}
                  onPress={() =>
                    navigation.navigate('WorkoutSession', {
                      activityId: entry.activityId,
                      activityTitle: entry.activityTitle,
                    })
                  }
                  style={[
                    styles.listRow,
                    index < history.length - 1 && {
                      borderBottomColor: colors.borderSubtle,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                    },
                  ]}>
                  <View style={styles.listRowTexts}>
                    <Day1Text variant="bodySemiBold16">{entry.activityTitle}</Day1Text>
                    <Day1Text variant="labelRegular13" color={colors.textSecondaryReadable}>
                      {longDateLabel(entry.scheduledDate)} · {entry.exerciseCount} ejercicios ·{' '}
                      {entry.setCount} series
                    </Day1Text>
                  </View>
                  <Day1Icon name="chevronRight" size={18} color={colors.textSecondaryReadable} />
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Day1Text variant="bodySemiBold16">Evolución por ejercicio</Day1Text>
            <Pressable
              onPress={() => navigation.navigate('ManageExercises')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Gestionar mis ejercicios">
              <Day1Text variant="labelSemiBold14" color={colors.actionPressed}>
                Mis ejercicios
              </Day1Text>
            </Pressable>
          </View>

          {exercisesError && exercises.length === 0 ? (
            <Day1ErrorState message={exercisesError} onRetry={reloadExercises} compact />
          ) : exercises.length === 0 ? (
            <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
              Cuando agregues ejercicios a una sesión, aparecerán aquí.
            </Day1Text>
          ) : (
            <>
              <Day1TextField
                label="Buscar ejercicio"
                value={exerciseSearch}
                onChangeText={setExerciseSearch}
                placeholder="Ej: Sentadilla, Press banca..."
                maxLength={80}
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterChipsRow}>
                <Pressable
                  onPress={() => setSelectedGroupFilter(null)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor:
                        selectedGroupFilter === null
                          ? colors.actionPrimary
                          : colors.surfaceSegmented,
                    },
                  ]}>
                  <Day1Text
                    variant={selectedGroupFilter === null ? 'labelSemiBold12' : 'labelRegular12'}
                    color={
                      selectedGroupFilter === null ? colors.textOnAction : colors.textPrimary
                    }>
                    Todos
                  </Day1Text>
                </Pressable>

                {MUSCLE_GROUP_PRESETS.map((preset) => {
                  const active = selectedGroupFilter === preset.key;
                  return (
                    <Pressable
                      key={preset.key}
                      onPress={() => setSelectedGroupFilter(active ? null : preset.key)}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: active
                            ? colors.actionPrimary
                            : colors.surfaceSegmented,
                        },
                      ]}>
                      <Day1Text
                        variant={active ? 'labelSemiBold12' : 'labelRegular12'}
                        color={active ? colors.textOnAction : colors.textPrimary}>
                        {preset.label}
                      </Day1Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {visibleExercises.length === 0 ? (
                <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
                  No encontramos ejercicios con ese filtro.
                </Day1Text>
              ) : (
                <View
                  style={[
                    styles.listCard,
                    { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
                  ]}>
                  {visibleExercises.map((exercise, index) => (
                    <Pressable
                      key={exercise.id}
                      accessibilityRole="button"
                      accessibilityLabel={exercise.name}
                      onPress={() =>
                        navigation.navigate('ExerciseProgress', {
                          exerciseId: exercise.id,
                          exerciseName: exercise.name,
                        })
                      }
                      style={[
                        styles.listRow,
                        index < visibleExercises.length - 1 && {
                          borderBottomColor: colors.borderSubtle,
                          borderBottomWidth: StyleSheet.hairlineWidth,
                        },
                      ]}>
                      <Day1ExerciseThumbnail
                        muscleGroup={exercise.muscleGroup}
                        exerciseName={exercise.name}
                        size={40}
                      />
                      <View style={styles.listRowTexts}>
                        <Day1Text variant="bodySemiBold16">{exercise.name}</Day1Text>
                        <Day1Text variant="labelRegular12" color={colors.textSecondaryReadable}>
                          {exercise.muscleGroup || 'General'}
                        </Day1Text>
                      </View>
                      <Day1Icon
                        name="chevronRight"
                        size={18}
                        color={colors.textSecondaryReadable}
                      />
                    </Pressable>
                  ))}
                </View>
              )}

              {!isFiltering && filteredExercises.length > INITIAL_EXERCISES_LIMIT ? (
                <Day1Button
                  label={
                    showAllExercises
                      ? 'Mostrar menos ejercicios'
                      : `Ver los ${filteredExercises.length} ejercicios`
                  }
                  variant="secondary"
                  onPress={() => setShowAllExercises((prev) => !prev)}
                />
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[20], gap: Spacing[20], paddingBottom: Spacing[40] },
  section: { gap: Spacing[10] },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[10] },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing[14],
    borderRadius: Radius[16],
    borderWidth: 1,
    gap: Spacing[4],
  },
  regionCard: {
    padding: Spacing[16],
    borderRadius: Radius[16],
    borderWidth: 1,
    gap: Spacing[12],
  },
  categoryRow: { gap: Spacing[6] },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestoneHeroRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[12] },
  milestoneAnimationBox: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneHeroTexts: { flex: 1, gap: Spacing[4] },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[8] },
  badge: {
    paddingHorizontal: Spacing[12],
    paddingVertical: Spacing[6],
    borderRadius: Radius[20],
    borderWidth: 1,
  },
  filterChipsRow: {
    gap: Spacing[8],
    paddingVertical: Spacing[2],
  },
  filterChip: {
    paddingHorizontal: Spacing[12],
    paddingVertical: Spacing[6],
    borderRadius: Radius[20],
  },
  listCard: { borderRadius: Radius[16], borderWidth: 1, overflow: 'hidden' },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing[12],
    paddingHorizontal: Spacing[16],
    paddingVertical: Spacing[12],
  },
  listRowTexts: { flex: 1, gap: 2 },
});
