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

type Props = NativeStackScreenProps<RootStackParamList, 'EditActivity'>;

export function EditActivityScreen({ route, navigation }: Props) {
  const colors = useTheme();
  const { activity } = route.params;
  const { categories, isLoading: loadingCategories } = useCategories();

  const [categoryId, setCategoryId] = useState(activity.categoryId);
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description ?? '');
  const [durationMinutes, setDurationMinutes] = useState(
    activity.durationMinutes ? String(activity.durationMinutes) : '',
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await api.patch(`/activities/${activity.id}`, {
        categoryId,
        title,
        description: description || undefined,
        durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
      });
      navigation.navigate('Main');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar.');
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

        <Day1Text variant="heading26">Editar actividad</Day1Text>

        {loadingCategories ? (
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
            Cargando categorías...
          </Day1Text>
        ) : (
          <Day1CategoryPicker categories={categories} selectedCategoryId={categoryId} onSelect={setCategoryId} />
        )}

        <Day1TextField label="Título" value={title} onChangeText={setTitle} />
        <Day1TextField label="Descripción" value={description} onChangeText={setDescription} />
        <Day1TextField
          label="Duración en minutos (solo si tiene hora)"
          value={durationMinutes}
          onChangeText={setDurationMinutes}
          keyboardType="number-pad"
          editable={!!activity.startTime}
        />

        {error ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>
            {error}
          </Day1Text>
        ) : null}

        <Day1Button
          label={saving ? 'Guardando...' : 'Guardar cambios'}
          variant="primary"
          onPress={handleSave}
          disabled={saving || !title}
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