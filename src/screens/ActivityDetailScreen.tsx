import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Badge, type Day1BadgeTone } from '@/components/atoms/Day1Badge';
import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Radius, Spacing } from '@/constants/theme';
import { longDateLabel, todayISODate } from '@/features/activities/dateUtils';
import { formatReminderLabel } from '@/features/activities/reminder';
import { useCategories } from '@/features/activities/useCategories';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import type { Activity } from '@/features/activities/types';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'ActivityDetail'>;

const CATEGORY_PHRASES: Record<string, string> = {
  study: 'Un momento para aprender',
  gym: 'Un momento para moverte',
  habits: 'Un momento para crecer',
  personal: 'Un momento para ti',
};

function getStatus(activity: Activity): { label: string; tone: Day1BadgeTone } {
  if (activity.completedAt) {
    return { label: 'Completada', tone: 'success' };
  }
  if (activity.scheduledDate < todayISODate()) {
    return { label: 'Actividad vencida', tone: 'error' };
  }
  return { label: 'Aún puedes hacerla', tone: 'warning' };
}

export function ActivityDetailScreen({ route, navigation }: Props) {
  const colors = useTheme();
  const { categories } = useCategories();
  const [activity, setActivity] = useState<Activity>(route.params.activity);
  const [working, setWorking] = useState(false);

  const category = categories.find((c) => c.id === activity.categoryId);
  const isGymActivity = category?.key === 'gym';
  const isCompleted = !!activity.completedAt;
  const status = getStatus(activity);
  const categoryPhrase = (category?.key && CATEGORY_PHRASES[category.key]) || 'Un momento para ti';

  async function handleToggleComplete() {
    setWorking(true);
    try {
      const updated = isCompleted
        ? await api.patch<Activity>(`/activities/${activity.id}/uncomplete`)
        : await api.patch<Activity>(`/activities/${activity.id}/complete`);
      setActivity(updated);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo actualizar la actividad.');
    } finally {
      setWorking(false);
    }
  }

  function confirmDelete() {
    Alert.alert(
      '¿Eliminar esta actividad?',
      activity.recurrenceId
        ? `Se eliminará "${activity.title}" del ${longDateLabel(activity.scheduledDate)}. Las próximas actividades de la serie seguirán en tu calendario.`
        : `Se eliminará "${activity.title}". Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar esta actividad',
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
      ],
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Day1Button label="← Volver" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <Day1Text variant="heading26">Tu próximo paso</Day1Text>

        <View style={styles.badgeRow}>
          <Day1Badge label={category?.name ?? 'Actividad'} tone="brand" />
          <Day1Badge label={status.label} tone={status.tone} />
        </View>

        <Day1Text variant="heading28">{activity.title}</Day1Text>

        <View style={[styles.metadataCard, { backgroundColor: colors.surfaceCard }]}>
          <View style={styles.metadataRow}>
            <Day1Text variant="bodyRegular16">📅</Day1Text>
            <Day1Text variant="bodyRegular16">{longDateLabel(activity.scheduledDate)}</Day1Text>
          </View>

          {activity.startTime ? (
            <View style={styles.metadataRow}>
              <Day1Text variant="bodyRegular16">🕐</Day1Text>
              <Day1Text variant="bodyRegular16">
                {activity.startTime.slice(0, 5)}
                {activity.durationMinutes ? ` · ${activity.durationMinutes} minutos` : ''}
              </Day1Text>
            </View>
          ) : null}

          {activity.recurrenceId ? (
            <View style={styles.metadataRow}>
              <Day1Text variant="bodyRegular16">🔁</Day1Text>
              <Day1Text variant="bodyRegular16">Esta actividad se repite</Day1Text>
            </View>
          ) : null}

          {activity.reminderMinutes ? (
            <View style={styles.metadataRow}>
              <Day1Text variant="bodyRegular16">🔔</Day1Text>
              <Day1Text variant="bodyRegular16">{formatReminderLabel(activity.reminderMinutes)}</Day1Text>
            </View>
          ) : null}
        </View>

        <View style={styles.block}>
          <Day1Text variant="section20">{categoryPhrase}</Day1Text>
          {activity.description ? (
            <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
              {activity.description}
            </Day1Text>
          ) : null}
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
            {isCompleted
              ? '¡Bien hecho! Ya diste este paso hoy.'
              : 'Tu día sigue abierto. Puedes hacerla ahora o buscar otro momento.'}
          </Day1Text>
        </View>

        {isGymActivity ? (
          <Day1Button
            label="Registrar sesión"
            variant="primary"
            onPress={() =>
              navigation.navigate('WorkoutSession', { activityId: activity.id, activityTitle: activity.title })
            }
          />
        ) : (
          <Day1Button
            label={working ? 'Guardando...' : isCompleted ? 'Marcar como pendiente' : '✓ Marcar como completada'}
            variant="primary"
            onPress={handleToggleComplete}
            disabled={working}
          />
        )}

        <View style={styles.row}>
          <Day1Button
            label="✏️ Editar"
            variant="secondary"
            style={styles.flex}
            onPress={() => navigation.navigate('EditActivity', { activity })}
          />
          <Day1Button
            label="🔁 Reprogramar"
            variant="secondary"
            style={styles.flex}
            onPress={() => navigation.navigate('RescheduleActivity', { activity })}
          />
        </View>

        <Day1Button
          label="🗑️ Eliminar actividad"
          variant="ghost"
          textColor={colors.statusError}
          onPress={confirmDelete}
          style={styles.deleteButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[24], gap: Spacing[16], paddingBottom: Spacing[40] },
  header: { flexDirection: 'row' },
  badgeRow: { flexDirection: 'row', gap: Spacing[8] },
  metadataCard: { borderRadius: Radius[16], padding: Spacing[16], gap: Spacing[12] },
  metadataRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[10] },
  block: { gap: Spacing[8] },
  row: { flexDirection: 'row', gap: Spacing[12] },
  flex: { flex: 1 },
  deleteButton: { marginTop: Spacing[4] },
});