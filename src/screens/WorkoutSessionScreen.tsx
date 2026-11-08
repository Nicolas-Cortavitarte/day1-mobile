import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { Day1WorkoutExerciseCard } from '@/components/organisms/Day1WorkoutExerciseCard';
import { Spacing } from '@/constants/theme';
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
  const { exercises, error: exercisesError, reload: reloadExercises, createExercise } = useExercises();

  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const addedExerciseIds = useMemo(
    () => new Set(session?.exercises.map((e) => e.exerciseId) ?? []),
    [session],
  );

  const normalizedSearch = search.trim().toLowerCase();

  const filteredExercises = useMemo(
    () =>
      exercises.filter(
        (e) => !addedExerciseIds.has(e.id) && e.name.toLowerCase().includes(normalizedSearch),
      ),
    [exercises, addedExerciseIds, normalizedSearch],
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
  }

  async function handleAddExisting(exerciseId: string) {
    if (saving) return;
    setSaving(true);
    setActionError(null);
    try {
      await addExercise(exerciseId);
      setSearch('');
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
      setMuscleGroup('');
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudo crear el ejercicio.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isLoading && !!session}
            onRefresh={reload}
            tintColor={colors.actionPrimary}
          />
        }>
        <View style={styles.header}>
          <Day1Button label="Volver" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <Day1Text variant="heading26">{activityTitle}</Day1Text>

        {error && !session ? (
          <View style={styles.createBox}>
            <Day1Text variant="labelRegular14" color={colors.statusError}>
              {error}
            </Day1Text>
            <Day1Button label="Reintentar" variant="secondary" onPress={reload} />
          </View>
        ) : isLoading && !session ? (
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
            Cargando sesión...
          </Day1Text>
        ) : (
          <>
            {session?.exercises.map((exercise) => (
              <Day1WorkoutExerciseCard
                key={exercise.id}
                exercise={exercise}
                onLogSet={(data) => logSet(exercise.id, data)}
              />
            ))}

            <View style={styles.addSection}>
              <Day1Text variant="bodySemiBold16">Agregar ejercicio</Day1Text>

              {exercisesError ? (
                <View style={styles.createBox}>
                  <Day1Text variant="labelRegular14" color={colors.statusError}>
                    {exercisesError}
                  </Day1Text>
                  <Day1Button label="Reintentar" variant="secondary" onPress={reloadExercises} />
                </View>
              ) : null}

              <Day1TextField
                label="Buscar o crear"
                value={search}
                onChangeText={handleSearchChange}
                placeholder="Ej: Press banca"
                maxLength={80}
              />

              {filteredExercises.map((exercise) => (
                <Day1Button
                  key={exercise.id}
                  label={exercise.name}
                  variant="secondary"
                  onPress={() => handleAddExisting(exercise.id)}
                  disabled={saving}
                />
              ))}

              {alreadyInSession ? (
                <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                  Ese ejercicio ya está en esta sesión.
                </Day1Text>
              ) : null}

              {canCreate ? (
                <View style={styles.createBox}>
                  <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                    No existe ese ejercicio todavía. Créalo:
                  </Day1Text>
                  <Day1TextField
                    label="Grupo muscular (opcional)"
                    value={muscleGroup}
                    onChangeText={setMuscleGroup}
                    placeholder="Pecho"
                    maxLength={60}
                  />
                  <Day1Button
                    label={saving ? 'Guardando...' : 'Crear y agregar'}
                    variant="primary"
                    onPress={handleCreateAndAdd}
                    disabled={saving}
                  />
                </View>
              ) : null}

              {actionError ? (
                <Day1Text variant="labelRegular14" color={colors.statusError}>
                  {actionError}
                </Day1Text>
              ) : null}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[16], gap: Spacing[16] },
  header: { flexDirection: 'row' },
  addSection: { gap: Spacing[8] },
  createBox: { gap: Spacing[8] },
});
