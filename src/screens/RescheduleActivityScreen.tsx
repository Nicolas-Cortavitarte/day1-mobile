import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'RescheduleActivity'>;

export function RescheduleActivityScreen({ route, navigation }: Props) {
  const colors = useTheme();
  const { activity } = route.params;

  const [toDate, setToDate] = useState(activity.scheduledDate);
  const [toTime, setToTime] = useState(activity.startTime ? activity.startTime.slice(0, 5) : '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await api.patch(`/activities/${activity.id}/reschedule`, {
        toDate,
        toTime: toTime || undefined,
      });
      navigation.navigate('Main');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo reprogramar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <View style={styles.content}>
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
          placeholder="2026-11-05"
        />

        <Day1TextField
          label="Nueva hora (HH:mm, opcional)"
          value={toTime}
          onChangeText={setToTime}
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
          disabled={saving || !toDate}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, padding: Spacing[16], gap: Spacing[16] },
  header: { flexDirection: 'row' },
});