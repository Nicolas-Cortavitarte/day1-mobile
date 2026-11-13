import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1CategoryPicker } from '@/components/molecules/Day1CategoryPicker';
import { Day1FeedbackModal } from '@/components/molecules/Day1FeedbackModal';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { Spacing } from '@/constants/theme';
import { useCategories } from '@/features/activities/useCategories';
import { getErrorMessage } from '@/lib/errors';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditActivity'>;
type EditScope = 'SINGLE' | 'SERIES';

export function EditActivityScreen({ route, navigation }: Props) {
  const colors = useTheme();
  const { activity } = route.params;
  const { categories, isLoading: loadingCategories, error: categoriesError, reload: reloadCategories } =
    useCategories();

  const [categoryId, setCategoryId] = useState(activity.categoryId);
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description ?? '');
  const [durationMinutes, setDurationMinutes] = useState(
    activity.durationMinutes ? String(activity.durationMinutes) : '',
  );
  const [scope, setScope] = useState<EditScope>('SINGLE');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedTitle, setSavedTitle] = useState<string | null>(null);

  async function handleSave() {
    if (saving) return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('El título de la actividad no puede estar vacío.');
      return;
    }

    let parsedDuration: number | null = null;
    const trimmedDuration = durationMinutes.trim();
    if (trimmedDuration) {
      const num = Number(trimmedDuration);
      if (!Number.isInteger(num) || num < 1 || num > 1440) {
        setError('La duración debe ser un número entero entre 1 y 1440 minutos.');
        return;
      }
      parsedDuration = num;
    }

    setSaving(true);
    setError(null);

    const payload = {
      categoryId,
      title: trimmedTitle,
      description: description.trim() || null,
      ...(activity.startTime ? { durationMinutes: parsedDuration } : {}),
    };

    try {
      if (activity.recurrenceId && scope === 'SERIES') {
        await api.patch(`/activity-recurrences/${activity.recurrenceId}`, payload);
      } else {
        await api.patch(`/activities/${activity.id}`, payload);
      }
      setSavedTitle(trimmedTitle);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar.'));
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

        <Day1Text variant="heading26">Editar actividad</Day1Text>

        {categoriesError ? (
          <View style={styles.block}>
            <Day1Text variant="labelRegular14" color={colors.statusError}>
              {categoriesError}
            </Day1Text>
            <Day1Button label="Reintentar" variant="secondary" onPress={reloadCategories} />
          </View>
        ) : loadingCategories ? (
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
            Cargando categorías...
          </Day1Text>
        ) : (
          <Day1CategoryPicker categories={categories} selectedCategoryId={categoryId} onSelect={setCategoryId} />
        )}

        <Day1TextField label="Título" value={title} onChangeText={setTitle} maxLength={120} />
        <Day1TextField label="Descripción" value={description} onChangeText={setDescription} maxLength={1000} />
        <Day1TextField
          label="Duración en minutos (solo si tiene hora)"
          value={durationMinutes}
          onChangeText={setDurationMinutes}
          keyboardType="number-pad"
          editable={!!activity.startTime}
        />

        {activity.recurrenceId ? (
          <View style={styles.block}>
            <Day1Text variant="labelMedium14">Alcance del cambio</Day1Text>
            <View style={styles.scopeRow}>
              <Day1Button
                label="Solo esta actividad"
                variant={scope === 'SINGLE' ? 'primary' : 'secondary'}
                onPress={() => setScope('SINGLE')}
                style={styles.flex}
              />
              <Day1Button
                label="Esta y las siguientes"
                variant={scope === 'SERIES' ? 'primary' : 'secondary'}
                onPress={() => setScope('SERIES')}
                style={styles.flex}
              />
            </View>
          </View>
        ) : null}

        {error ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>
            {error}
          </Day1Text>
        ) : null}

        <Day1Button
          label={saving ? 'Guardando...' : 'Guardar cambios'}
          variant="primary"
          onPress={handleSave}
          disabled={saving || !title.trim()}
        />
      </ScrollView>

      <Day1FeedbackModal
        visible={savedTitle !== null}
        title="Actividad actualizada"
        message={
          savedTitle ? `Los cambios en «${savedTitle}» quedaron guardados.` : undefined
        }
        onClose={() => {
          setSavedTitle(null);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[16], gap: Spacing[16] },
  header: { flexDirection: 'row' },
  block: { gap: Spacing[8] },
  scopeRow: { flexDirection: 'row', gap: Spacing[8] },
  flex: { flex: 1 },
});
