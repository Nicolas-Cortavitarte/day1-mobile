import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import {
  Day1ExerciseThumbnail,
  MUSCLE_GROUP_PRESETS,
} from '@/components/atoms/Day1ExerciseThumbnail';
import { Day1Icon } from '@/components/atoms/Day1Icon';
import { Day1KeyboardScrollView } from '@/components/atoms/Day1KeyboardScrollView';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1ErrorState } from '@/components/molecules/Day1ErrorState';
import { Day1FeedbackModal } from '@/components/molecules/Day1FeedbackModal';
import { Day1InlineNotice } from '@/components/molecules/Day1InlineNotice';
import { Day1MuscleGroupChips } from '@/components/molecules/Day1MuscleGroupChips';
import { Day1SkeletonCardList } from '@/components/molecules/Day1SkeletonGroup';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { Day1WorkoutExerciseCard } from '@/components/organisms/Day1WorkoutExerciseCard';
import { MinTouchTarget, Radius, Spacing } from '@/constants/theme';
import { useExercises } from '@/features/workouts/useExercises';
import { useWorkoutSession } from '@/features/workouts/useWorkoutSession';
import { getErrorMessage } from '@/lib/errors';
import { useTheme } from '@/hooks/use-theme';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutSession'>;

export function WorkoutSessionScreen({ route, navigation }: Props) {
  const colors = useTheme();
  const { activityId, activityTitle } = route.params;

  const { session, isLoading, error, reload, addExercise, logSet } = useWorkoutSession(activityId);
  const {
    exercises,
    error: exercisesError,
    reload: reloadExercises,
    createExercise,
  } = useExercises();

  const [comboOpen, setComboOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState(MUSCLE_GROUP_PRESETS[0].label);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [createdExerciseName, setCreatedExerciseName] = useState<string | null>(null);

  const exerciseById = useMemo(
    () => new Map(exercises.map((e) => [e.id, e])),
    [exercises],
  );

  const addedExerciseIds = useMemo(
    () => new Set(session?.exercises.map((e) => e.exerciseId) ?? []),
    [session],
  );

  const normalizedSearch = search.trim().toLowerCase();

  const availableExercises = useMemo(
    () => exercises.filter((e) => !addedExerciseIds.has(e.id)),
    [exercises, addedExerciseIds],
  );

  const filteredExercises = useMemo(
    () =>
      availableExercises.filter(
        (e) =>
          e.name.toLowerCase().includes(normalizedSearch) ||
          (e.muscleGroup ?? '').toLowerCase().includes(normalizedSearch),
      ),
    [availableExercises, normalizedSearch],
  );

  const exactMatch = useMemo(
    () => exercises.find((e) => e.name.trim().toLowerCase() === normalizedSearch) ?? null,
    [exercises, normalizedSearch],
  );

  const alreadyInSession = exactMatch ? addedExerciseIds.has(exactMatch.id) : false;
  const canCreate = normalizedSearch.length > 0 && !exactMatch;

  function handleSearchChange(text: string) {
    setSearch(text);
    setActionError(null);
    if (!comboOpen) setComboOpen(true);
  }

  async function handleAddExisting(exerciseId: string) {
    if (saving) return;
    setSaving(true);
    setActionError(null);
    try {
      await addExercise(exerciseId);
      setSearch('');
      setComboOpen(false);
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudo agregar el ejercicio.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateAndAdd() {
    if (saving) return;
    const name = search.trim();
    if (!name) return;
    setSaving(true);
    setActionError(null);
    try {
      const exercise = await createExercise(name, muscleGroup.trim() || undefined);
      try {
        await addExercise(exercise.id);
      } catch (err) {
        setActionError(
          `${getErrorMessage(err, 'No se pudo agregar el ejercicio a la sesión.')} El ejercicio ya quedó creado, selecciónalo de la lista.`,
        );
        return;
      }
      setSearch('');
      setComboOpen(false);
      setCreatedExerciseName(exercise.name);
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudo crear el ejercicio.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <Day1KeyboardScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && !!session}
            onRefresh={reload}
            tintColor={colors.actionPrimary}
          />
        }>
        <View style={styles.header}>
          <Day1Button
            label="Volver"
            icon="arrowLeft"
            variant="ghost"
            onPress={() => navigation.goBack()}
          />
        </View>

        <Day1Text variant="heading26">{activityTitle}</Day1Text>

        {error && !session ? (
          <Day1ErrorState message={error} onRetry={reload} compact />
        ) : isLoading && !session ? (
          <Day1SkeletonCardList count={3} />
        ) : (
          <>
            {session?.exercises.map((exercise) => (
              <Day1WorkoutExerciseCard
                key={exercise.id}
                exercise={exercise}
                muscleGroup={exerciseById.get(exercise.exerciseId)?.muscleGroup}
                onLogSet={(data) => logSet(exercise.id, data)}
              />
            ))}

            <View
              style={[
                styles.addSection,
                { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
              ]}>
              <Day1Text variant="bodySemiBold16">Agregar ejercicio</Day1Text>

              {exercisesError ? (
                <Day1ErrorState message={exercisesError} onRetry={reloadExercises} compact />
              ) : null}

              <Pressable
                onPress={() => setComboOpen((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel="Seleccionar o buscar ejercicio"
                style={[
                  styles.comboTrigger,
                  {
                    backgroundColor: colors.backgroundDefault,
                    borderColor: comboOpen ? colors.actionPrimary : colors.borderControl,
                  },
                ]}>
                <View style={styles.comboTriggerLeft}>
                  <Day1Icon name="dumbbell" size={18} color={colors.actionPrimary} />
                  <Day1Text
                    variant="bodyRegular16"
                    color={comboOpen ? colors.textPrimary : colors.textSecondaryReadable}>
                    {comboOpen
                      ? 'Ocultar lista de ejercicios'
                      : `Elegir ejercicio (${availableExercises.length} disponibles)`}
                  </Day1Text>
                </View>
                <Day1Icon
                  name={comboOpen ? 'chevronRight' : 'chevronDown'}
                  size={18}
                  color={colors.textSecondaryReadable}
                />
              </Pressable>

              {comboOpen ? (
                <View style={styles.dropdownPanel}>
                  <Day1TextField
                    label="Buscar o crear nuevo"
                    value={search}
                    onChangeText={handleSearchChange}
                    placeholder="Ej: Press banca, Sentadilla..."
                    maxLength={80}
                  />

                  <ScrollView
                    style={styles.dropdownList}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled">
                    {filteredExercises.map((exercise, index) => (
                      <Pressable
                        key={exercise.id}
                        disabled={saving}
                        onPress={() => handleAddExisting(exercise.id)}
                        style={[
                          styles.optionRow,
                          index < filteredExercises.length - 1 && {
                            borderBottomColor: colors.borderSubtle,
                            borderBottomWidth: StyleSheet.hairlineWidth,
                          },
                        ]}>
                        <Day1ExerciseThumbnail
                          muscleGroup={exercise.muscleGroup}
                          exerciseName={exercise.name}
                          size={38}
                        />
                        <View style={styles.optionTexts}>
                          <Day1Text variant="bodySemiBold16">{exercise.name}</Day1Text>
                          <Day1Text variant="labelRegular12" color={colors.textSecondaryReadable}>
                            {exercise.muscleGroup || 'General'}
                          </Day1Text>
                        </View>
                        <Day1Icon name="plus" size={18} color={colors.actionPrimary} />
                      </Pressable>
                    ))}
                  </ScrollView>

                  {alreadyInSession ? (
                    <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                      Ese ejercicio ya está en esta sesión.
                    </Day1Text>
                  ) : null}

                  {canCreate ? (
                    <View
                      style={[
                        styles.createBox,
                        { backgroundColor: colors.backgroundDefault, borderColor: colors.borderSubtle },
                      ]}>
                      <Day1Text variant="labelMedium14">
                        ¿No está «{search.trim()}»? Créalo y agrégalo:
                      </Day1Text>
                      <Day1MuscleGroupChips value={muscleGroup} onChange={setMuscleGroup} compact />
                      <Day1Button
                        label={saving ? 'Guardando...' : 'Crear y agregar a la sesión'}
                        icon="plus"
                        variant="primary"
                        onPress={handleCreateAndAdd}
                        disabled={saving}
                      />
                    </View>
                  ) : null}
                </View>
              ) : null}

              {actionError ? <Day1InlineNotice message={actionError} /> : null}
            </View>
          </>
        )}
      </Day1KeyboardScrollView>

      <Day1FeedbackModal
        visible={createdExerciseName !== null}
        title="¡Ejercicio creado!"
        message={
          createdExerciseName
            ? `«${createdExerciseName}» se agregó a tu catálogo y a esta sesión.`
            : undefined
        }
        onClose={() => setCreatedExerciseName(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[20], gap: Spacing[16], paddingBottom: Spacing[40] },
  header: { flexDirection: 'row' },
  addSection: {
    padding: Spacing[16],
    borderRadius: Radius[16],
    borderWidth: 1,
    gap: Spacing[12],
  },
  comboTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MinTouchTarget + 6,
    paddingHorizontal: Spacing[14],
    paddingVertical: Spacing[12],
    borderRadius: Radius[12],
    borderWidth: 1,
  },
  comboTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[10],
    flex: 1,
  },
  dropdownPanel: {
    gap: Spacing[12],
  },
  dropdownList: {
    maxHeight: 240,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[12],
    paddingVertical: Spacing[10],
    paddingHorizontal: Spacing[6],
  },
  optionTexts: {
    flex: 1,
    gap: 2,
  },
  createBox: {
    gap: Spacing[10],
    padding: Spacing[12],
    borderRadius: Radius[12],
    borderWidth: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[6],
  },
  chip: {
    paddingHorizontal: Spacing[10],
    paddingVertical: Spacing[6],
    borderRadius: Radius[16],
  },
});
