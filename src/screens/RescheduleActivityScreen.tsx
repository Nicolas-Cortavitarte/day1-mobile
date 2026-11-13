import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1DateField } from '@/components/atoms/Day1DateField';
import { Day1Icon } from '@/components/atoms/Day1Icon';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1InlineNotice } from '@/components/molecules/Day1InlineNotice';
import { Radius, Spacing } from '@/constants/theme';
import { checkActivityConflicts } from '@/features/activities/checkConflicts';
import { formatTime, longDateLabel, parseISODate, todayISODate, toISODate } from '@/features/activities/dateUtils';
import { getErrorMessage } from '@/lib/errors';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'RescheduleActivity'>;

function parseTimeToDate(timeString: string | null): Date | null {
  if (!timeString) return null;
  const [hoursStr, minutesStr] = timeString.slice(0, 5).split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function RescheduleActivityScreen({ route, navigation }: Props) {
  const colors = useTheme();
  const { activity } = route.params;

  const initialDate =
    activity.scheduledDate < todayISODate()
      ? new Date()
      : parseISODate(activity.scheduledDate);

  const [toDate, setToDate] = useState<Date>(initialDate);
  const [toTime, setToTime] = useState<Date | null>(() => parseTimeToDate(activity.startTime));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (saving) return;
    setError(null);

    const normalizedDate = toISODate(toDate);
    const normalizedTime = toTime ? formatTime(toTime) : '';

    if (normalizedDate < todayISODate()) {
      setError('No puedes reprogramar una actividad a una fecha pasada.');
      return;
    }

    setSaving(true);

    try {
      if (normalizedTime) {
        const conflicts = await checkActivityConflicts({
          date: normalizedDate,
          startTime: normalizedTime,
          durationMinutes: activity.durationMinutes,
          excludeActivityId: activity.id,
        });
        if (conflicts.length > 0) {
          setError(`Ya tienes "${conflicts[0].title}" en ese horario.`);
          setSaving(false);
          return;
        }
      }

      await api.patch(`/activities/${activity.id}/reschedule`, {
        toDate: normalizedDate,
        toTime: normalizedTime || null,
      });
      navigation.navigate('Main');
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo reprogramar.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Day1Button label="Volver" icon="arrowLeft" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <View style={styles.titleBlock}>
          <Day1Text variant="heading26">Reprogramar</Day1Text>
          <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
            Elige un nuevo momento para «{activity.title}».
          </Day1Text>
        </View>

        <View style={[styles.currentCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
          <Day1Text variant="labelMedium12" color={colors.textSecondaryReadable}>
            Fecha actual
          </Day1Text>
          <View style={styles.currentRow}>
            <Day1Icon name="calendar" size={18} color={colors.actionPrimary} />
            <Day1Text variant="bodySemiBold16" style={styles.capitalize}>
              {longDateLabel(activity.scheduledDate)}
              {activity.startTime ? ` · ${activity.startTime.slice(0, 5)}` : ' · A tu ritmo'}
            </Day1Text>
          </View>
        </View>

        <View style={styles.fieldsCard}>
          <Day1DateField
            label="Nueva fecha"
            mode="date"
            value={toDate}
            onChange={(date) => {
              setToDate(date);
              setError(null);
            }}
            minimumDate={new Date()}
          />

          <Day1DateField
            label="Nueva hora (opcional)"
            mode="time"
            value={toTime}
            onChange={(time) => {
              setToTime(time);
              setError(null);
            }}
            onClear={() => {
              setToTime(null);
              setError(null);
            }}
            placeholder="A tu ritmo (sin hora)"
          />
        </View>

        {error ? <Day1InlineNotice message={error} /> : null}

        <Day1Button
          label={saving ? 'Guardando...' : 'Confirmar nueva fecha'}
          icon="check"
          variant="primary"
          onPress={handleSave}
          disabled={saving}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[24], gap: Spacing[20], paddingBottom: Spacing[40] },
  header: { flexDirection: 'row' },
  titleBlock: { gap: Spacing[6] },
  currentCard: {
    padding: Spacing[16],
    borderRadius: Radius[16],
    borderWidth: 1,
    gap: Spacing[6],
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[8],
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  fieldsCard: {
    gap: Spacing[16],
  },
});
