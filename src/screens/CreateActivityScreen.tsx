import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1CategoryPicker } from '@/components/molecules/Day1CategoryPicker';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { Spacing } from '@/constants/theme';
import { useCategories } from '@/features/activities/useCategories';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateActivity'>;

function todayISODate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function CreateActivityScreen({ navigation }: Props) {
  const colors = useTheme();
  const { categories, isLoading: loadingCategories } = useCategories();

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!categoryId) {
      setError('Elige una categoría.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await api.post('/activities', {
        categoryId,
        title,
        scheduledDate: todayISODate(),
        startTime: startTime || undefined,
        durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
      });
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la actividad.');
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

        <Day1Text variant="heading26">Nueva actividad</Day1Text>

        {loadingCategories ? (
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
            Cargando categorías...
          </Day1Text>
        ) : (
          <Day1CategoryPicker
            categories={categories}
            selectedCategoryId={categoryId}
            onSelect={setCategoryId}
          />
        )}

        <Day1TextField label="Título" value={title} onChangeText={setTitle} placeholder="Ej: Repasar inglés" />

        <Day1TextField
          label="Hora (opcional, formato HH:mm)"
          value={startTime}
          onChangeText={setStartTime}
          placeholder="09:00"
          keyboardType="numbers-and-punctuation"
        />

        <Day1TextField
          label="Duración en minutos (solo si pusiste hora)"
          value={durationMinutes}
          onChangeText={setDurationMinutes}
          placeholder="60"
          keyboardType="number-pad"
          editable={!!startTime}
        />

        {error ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>
            {error}
          </Day1Text>
        ) : null}

        <Day1Button
          label={saving ? 'Guardando...' : 'Guardar actividad'}
          variant="primary"
          onPress={handleCreate}
          disabled={saving || !title || !categoryId}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, padding: Spacing[16], gap: Spacing[16] },
  header: { flexDirection: 'row', justifyContent: 'flex-end' },
});