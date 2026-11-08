import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { Spacing } from '@/constants/theme';
import { checkActivityConflicts } from '@/features/activities/checkConflicts';
import { todayISODate } from '@/features/activities/dateUtils';
import { getErrorMessage } from '@/lib/errors';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'RescheduleActivity'>;

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export function RescheduleActivityScreen({ route, navigation }: Props) {
  const colors = useTheme();
  const { activity } = route.params;

  const [toDate, setToDate] = useState(activity.scheduledDate);
  const [toTime, setToTime] = useState(activity.startTime ? activity.startTime.slice(0, 5) : '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (saving) return;
    setError(null);

    const normalizedDate = toDate.trim();
    const normalizedTime = toTime.trim();

    if (!ISO_DATE_REGEX.test(normalizedDate)) {
      setError('Escribe la fecha en formato YYYY-MM-DD.');
      return;
    }

    if (normalizedDate < todayISODate()) {
      setError('No puedes reprogramar una actividad a una fecha pasada.');
      return;
    }

    if (normalizedTime && !TIME_REGEX.test(normalizedTime)) {
      setError('Escribe la hora en formato HH:mm (por ejemplo, 09:00).');
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
          <Day1Button label="Cancelar" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <Day1Text variant="heading26">Reprogramar</Day1Text>
        <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
          "{activity.title}"
        </Day1Text>

        <Day1TextField
          label="Nueva fecha (YYYY-MM-DD)"
          value={toDate}
          onChangeText={setToDate}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="2026-11-05"
        />

        <Day1TextField
          label="Nueva hora (HH:mm, opcional)"
          value={toTime}
          onChangeText={setToTime}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="09:00"
          keyboardType="numbers-and-punctuation"
        />

        {error ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>
            {error}
          </Day1Text>
        ) : null}

        <Day1Button
          label={saving ? 'Guardando...' : 'Confirmar nueva fecha'}
          variant="primary"
          onPress={handleSave}
          disabled={saving || !toDate.trim()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[16], gap: Spacing[16] },
  header: { flexDirection: 'row' },
});
