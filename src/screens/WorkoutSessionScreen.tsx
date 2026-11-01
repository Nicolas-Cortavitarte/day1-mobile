import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { Day1WorkoutExerciseCard } from '@/components/organisms/Day1WorkoutExerciseCard';
import { Spacing } from '@/constants/theme';
import { useExercises } from '@/features/workouts/useExercises';
import { useWorkoutSession } from '@/features/workouts/useWorkoutSession';
import { useTheme } from '@/hooks/use-theme';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutSession'>;

export function WorkoutSessionScreen({ route, navigation }: Props) {
  const colors = useTheme();
  const { activityId, activityTitle } = route.params;

  const { session, isLoading, error, addExercise, logSet } = useWorkoutSession(activityId);
  const { exercises, createExercise } = useExercises();

  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [saving, setSaving] = useState(false);

  const addedExerciseIds = useMemo(
    () => new Set(session?.exercises.map((e) => e.exerciseId) ?? []),
    [session],
  );

  const filteredExercises = useMemo(
    () =>
      exercises.filter(
        (e) => !addedExerciseIds.has(e.id) && e.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [exercises, addedExerciseIds, search],
  );

  const noMatches = search.trim().length > 0 && filteredExercises.length === 0;

  async function handleAddExisting(exerciseId: string) {
    setSaving(true);
    try {
      await addExercise(exerciseId);
      setSearch('');
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateAndAdd() {
    setSaving(true);
    try {
      const exercise = await createExercise(search.trim(), muscleGroup.trim() || undefined);
      await addExercise(exercise.id);
      setSearch('');
      setMuscleGroup('');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Day1Button label="Volver" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <Day1Text variant="heading26">{activityTitle}</Day1Text>

        {error ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>
            {error}
          </Day1Text>
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

              <Day1TextField
                label="Buscar o crear"
                value={search}
                onChangeText={setSearch}
                placeholder="Ej: Press banca"
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

              {noMatches ? (
                <View style={styles.createBox}>
                  <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                    No existe ese ejercicio todavía. Créalo:
                  </Day1Text>
                  <Day1TextField
                    label="Grupo muscular (opcional)"
                    value={muscleGroup}
                    onChangeText={setMuscleGroup}
                    placeholder="Pecho"
                  />
                  <Day1Button
                    label="Crear y agregar"
                    variant="primary"
                    onPress={handleCreateAndAdd}
                    disabled={saving}
                  />
                </View>
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