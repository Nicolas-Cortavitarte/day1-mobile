import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Badge, type Day1BadgeTone } from '@/components/atoms/Day1Badge';
import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Icon } from '@/components/atoms/Day1Icon';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1ConfirmDeleteModal } from '@/components/molecules/Day1ConfirmDeleteModal';
import { Day1InlineNotice } from '@/components/molecules/Day1InlineNotice';
import { Radius, Spacing } from '@/constants/theme';
import { isPastDate, longDateLabel, todayISODate } from '@/features/activities/dateUtils';
import { recurrenceFromApi, recurrenceSummaryLabel } from '@/features/activities/recurrence';
import { formatReminderLabel } from '@/features/activities/reminder';
import { useCategories } from '@/features/activities/useCategories';
import { getErrorMessage } from '@/lib/errors';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import type { Activity, ActivityRecurrence } from '@/features/activities/types';
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
  const [recurrenceLabel, setRecurrenceLabel] = useState<string>('Esta actividad se repite');
  const [working, setWorking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      api
        .get<Activity>(`/activities/${route.params.activity.id}`)
        .then((fresh) => {
          if (active) setActivity(fresh);
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }, [route.params.activity.id]),
  );

  useEffect(() => {
    if (!activity.recurrenceId) return;
    let active = true;
    api
      .get<ActivityRecurrence>(`/activity-recurrences/${activity.recurrenceId}`)
      .then((rule) => {
        if (active) {
          setRecurrenceLabel(recurrenceSummaryLabel(recurrenceFromApi(rule)));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [activity.recurrenceId]);

  const category = categories.find((c) => c.id === activity.categoryId);
  const isGymActivity = category?.key === 'gym';
  const isCompleted = !!activity.completedAt;
  const isPast = isPastDate(activity.scheduledDate);
  const status = getStatus(activity);
  const categoryPhrase = (category?.key && CATEGORY_PHRASES[category.key]) || 'Un momento para ti';

  async function handleToggleComplete() {
    if (working || isPast) return;
    setWorking(true);
    setActionError(null);
    try {
      const updated = isCompleted
        ? await api.patch<Activity>(`/activities/${activity.id}/uncomplete`)
        : await api.patch<Activity>(`/activities/${activity.id}/complete`);
      setActivity(updated);
    } catch (err) {
      setActionError(getErrorMessage(err, 'No se pudo actualizar la actividad.'));
    } finally {
      setWorking(false);
    }
  }

  async function handleConfirmDelete() {
    if (deleting) return;
    setDeleting(true);
    setActionError(null);
    try {
      await api.delete(`/activities/${activity.id}`);
      setDeleteModalVisible(false);
      navigation.navigate('Main');
    } catch (err) {
      setDeleteModalVisible(false);
      setActionError(getErrorMessage(err, 'No se pudo eliminar la actividad.'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Day1Button label="Volver" icon="arrowLeft" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <View style={styles.titleBlock}>
          <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
            Tu próximo paso
          </Day1Text>
          <View style={styles.badgeRow}>
            <Day1Badge label={category?.name ?? 'Actividad'} tone="brand" />
            <Day1Badge label={status.label} tone={status.tone} />
          </View>
          <Day1Text variant="heading28">{activity.title}</Day1Text>
        </View>

        {actionError ? <Day1InlineNotice message={actionError} /> : null}

        <View style={[styles.metadataCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
          <View style={styles.metadataRow}>
            <Day1Icon name="calendar" size={18} color={colors.textSecondaryReadable} />
            <Day1Text variant="bodyRegular16">{longDateLabel(activity.scheduledDate)}</Day1Text>
          </View>

          {activity.startTime ? (
            <View style={styles.metadataRow}>
              <Day1Icon name="clock" size={18} color={colors.textSecondaryReadable} />
              <Day1Text variant="bodyRegular16">
                {activity.startTime.slice(0, 5)}
                {activity.durationMinutes ? ` · ${activity.durationMinutes} minutos` : ''}
              </Day1Text>
            </View>
          ) : null}

          {activity.recurrenceId ? (
            <View style={styles.metadataRow}>
              <Day1Icon name="repeat" size={18} color={colors.textSecondaryReadable} />
              <Day1Text variant="bodyRegular16">{recurrenceLabel}</Day1Text>
            </View>
          ) : null}

          {activity.reminderMinutes !== null ? (
            <View style={styles.metadataRow}>
              <Day1Icon name="bell" size={18} color={colors.textSecondaryReadable} />
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
              ? '¡Bien hecho! Ya diste este paso.'
              : isPast
                ? 'Esta fecha ya pasó. No se puede marcar como completada, pero puedes reprogramarla para hoy o más adelante.'
                : 'Tu día sigue abierto. Puedes hacerla ahora o buscar otro momento.'}
          </Day1Text>
        </View>

        <View style={styles.actionsSection}>
          {isGymActivity ? (
            <Day1Button
              label={
                isPast && !isCompleted
                  ? 'Sesión vencida (reprograma para registrar)'
                  : isCompleted
                    ? 'Ver sesión registrada'
                    : 'Registrar sesión'
              }
              icon="dumbbell"
              variant="primary"
              disabled={isPast && !isCompleted}
              onPress={() =>
                navigation.navigate('WorkoutSession', { activityId: activity.id, activityTitle: activity.title })
              }
            />
          ) : (
            <Day1Button
              label={
                working
                  ? 'Guardando...'
                  : isPast
                    ? isCompleted
                      ? 'Completada en fecha pasada'
                      : 'No disponible en fecha pasada'
                    : isCompleted
                      ? 'Marcar como pendiente'
                      : 'Marcar como completada'
              }
              icon={isCompleted || isPast ? undefined : 'check'}
              variant="primary"
              onPress={handleToggleComplete}
              disabled={working || isPast}
            />
          )}

          <View style={styles.row}>
            <Day1Button
              label="Editar"
              icon="edit"
              variant="secondary"
              style={styles.flex}
              onPress={() => navigation.navigate('EditActivity', { activity })}
            />
            <Day1Button
              label="Reprogramar"
              icon="repeat"
              variant="secondary"
              style={styles.flex}
              onPress={() => navigation.navigate('RescheduleActivity', { activity })}
            />
          </View>

          <Day1Button
            label="Eliminar actividad"
            icon="trash"
            variant="ghost"
            textColor={colors.statusError}
            onPress={() => setDeleteModalVisible(true)}
            style={styles.deleteButton}
          />
        </View>
      </ScrollView>

      <Day1ConfirmDeleteModal
        visible={deleteModalVisible}
        title="¿Eliminar esta actividad?"
        message={
          activity.recurrenceId
            ? `Se eliminará "${activity.title}" del ${longDateLabel(activity.scheduledDate)}. Las próximas actividades de la serie seguirán en tu calendario.`
            : `Se eliminará "${activity.title}". Esta acción no se puede deshacer.`
        }
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[24], gap: Spacing[20], paddingBottom: Spacing[40] },
  header: { flexDirection: 'row' },
  titleBlock: { gap: Spacing[8] },
  badgeRow: { flexDirection: 'row', gap: Spacing[8] },
  metadataCard: { borderRadius: Radius[16], borderWidth: 1, padding: Spacing[16], gap: Spacing[12] },
  metadataRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[10] },
  block: { gap: Spacing[6] },
  actionsSection: { gap: Spacing[12], marginTop: Spacing[4] },
  row: { flexDirection: 'row', gap: Spacing[12] },
  flex: { flex: 1 },
  deleteButton: { marginTop: Spacing[4] },
});
