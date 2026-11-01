import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import type { RootStackParamList } from '@/app/navigation-types';
import { useCategories } from '@/features/activities/useCategories';

type Props = NativeStackScreenProps<RootStackParamList, 'ActivityDetail'>;

export function ActivityDetailScreen({ route, navigation }: Props) {
  const colors = useTheme();
  const { activity } = route.params;
  const isCompleted = !!activity.completedAt;
  const { categories } = useCategories();
  const isGymActivity = categories.find((c) => c.id === activity.categoryId)?.key === 'gym';

  function confirmDelete() {
    Alert.alert('Eliminar actividad', `¿Seguro que quieres eliminar "${activity.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/activities/${activity.id}`);
            navigation.navigate('Main');
          } catch (err) {
            Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo eliminar.');
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Day1Button label="Volver" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <Day1Text variant="heading26">{activity.title}</Day1Text>

        <Day1Text variant="labelMedium14" color={colors.textSecondaryReadable}>
          {isCompleted ? 'Completada ✅' : 'Pendiente'}
        </Day1Text>

        <View style={styles.row}>
          <Day1Text variant="labelMedium14" color={colors.textSecondaryReadable}>
            Fecha
          </Day1Text>
          <Day1Text variant="bodyRegular16">{activity.scheduledDate}</Day1Text>
        </View>

        {activity.startTime ? (
          <View style={styles.row}>
            <Day1Text variant="labelMedium14" color={colors.textSecondaryReadable}>
              Hora
            </Day1Text>
            <Day1Text variant="bodyRegular16">{activity.startTime.slice(0, 5)}</Day1Text>
          </View>
        ) : null}

        {activity.durationMinutes ? (
          <View style={styles.row}>
            <Day1Text variant="labelMedium14" color={colors.textSecondaryReadable}>
              Duración
            </Day1Text>
            <Day1Text variant="bodyRegular16">{activity.durationMinutes} min</Day1Text>
          </View>
        ) : null}

        {activity.description ? (
          <View style={styles.row}>
            <Day1Text variant="labelMedium14" color={colors.textSecondaryReadable}>
              Descripción
            </Day1Text>
            <Day1Text variant="bodyRegular16">{activity.description}</Day1Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          {isGymActivity ? (
            <Day1Button
              label="Registrar sesión"
              variant="primary"
              onPress={() => navigation.navigate('WorkoutSession', { activityId: activity.id, activityTitle: activity.title })}
            />
          ) : null}
          <Day1Button label="Editar" variant="secondary" onPress={() => navigation.navigate('EditActivity', { activity })} />
          <Day1Button
            label="Reprogramar"
            variant="secondary"
            onPress={() => navigation.navigate('RescheduleActivity', { activity })}
          />
          <Day1Button label="Eliminar" variant="destructive" onPress={confirmDelete} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, padding: Spacing[16], gap: Spacing[16] },
  header: { flexDirection: 'row' },
  row: { gap: 4 },
  actions: { gap: Spacing[8], marginTop: 'auto' },
});