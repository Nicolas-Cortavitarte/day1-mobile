import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Spacing } from '@/constants/theme';
import { longDateLabel } from '@/features/activities/dateUtils';
import { useExercises } from '@/features/workouts/useExercises';
import { useWorkoutHistory } from '@/features/workouts/useWorkoutHistory';
import { useTheme } from '@/hooks/use-theme';
import type { MainTabScreenProps } from '@/app/navigation-types';

type Props = MainTabScreenProps<'Progreso'>;

export function ProgresoScreen({ navigation }: Props) {
  const colors = useTheme();
  const { history, isLoading, error, reload } = useWorkoutHistory();
  const { exercises } = useExercises();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Day1Text variant="heading26">Progreso</Day1Text>

        <Day1Text variant="bodySemiBold16">Historial de sesiones</Day1Text>

        {error ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>
            {error}
          </Day1Text>
        ) : isLoading ? (
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
});