import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Badge } from '@/components/atoms/Day1Badge';
import { Day1Button } from '@/components/atoms/Day1Button';
import {
  Day1ExerciseThumbnail,
  MUSCLE_GROUP_PRESETS,
} from '@/components/atoms/Day1ExerciseThumbnail';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1ConfirmDeleteModal } from '@/components/molecules/Day1ConfirmDeleteModal';
import { Day1ErrorState } from '@/components/molecules/Day1ErrorState';
import { Day1FeedbackModal } from '@/components/molecules/Day1FeedbackModal';
import { Day1InlineNotice } from '@/components/molecules/Day1InlineNotice';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { Radius, Spacing } from '@/constants/theme';
import { useExercises } from '@/features/workouts/useExercises';
import { getErrorMessage } from '@/lib/errors';
import { useTheme } from '@/hooks/use-theme';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'ManageExercises'>;

export function ManageExercisesScreen({ navigation }: Props) {
  const colors = useTheme();
  const {
    exercises,
    isLoading,
    error,
    reload,
    createExercise,
    updateExercise,
    deleteExercise,
  } = useExercises();

  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState(MUSCLE_GROUP_PRESETS[0].label);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{
    title: string;
    message: string;
    tone: 'success' | 'delete';
  } | null>(null);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredExercises = useMemo(
    () =>
      exercises.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(normalizedSearch) ||
          (exercise.muscleGroup ?? '').toLowerCase().includes(normalizedSearch),
      ),
    [exercises, normalizedSearch],
  );

  function startEdit(id: string, currentName: string, currentGroup: string | null) {
    setEditingId(id);
    setName(currentName);
    setMuscleGroup(currentGroup ?? '');
    setFormError(null);
  }

  function resetForm() {
    setEditingId(null);
    setName('');
    setMuscleGroup(MUSCLE_GROUP_PRESETS[0].label);
    setFormError(null);
  }

  async function handleSave() {
    if (saving || !name.trim()) return;
    setSaving(true);
    setFormError(null);
    try {
      const cleanName = name.trim();
      const cleanGroup = muscleGroup.trim();
      if (editingId !== null) {
        await updateExercise(editingId, {
          name: cleanName,
          muscleGroup: cleanGroup || null,
        });
        setFeedback({
          title: 'Ejercicio actualizado',
          message: `«${cleanName}» quedó guardado.`,
          tone: 'success',
        });
      } else {
        await createExercise(cleanName, cleanGroup || undefined);
        setFeedback({
          title: '¡Ejercicio creado!',
          message: `«${cleanName}» ya está en tu catálogo.`,
          tone: 'success',
        });
      }
      resetForm();
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo guardar el ejercicio.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    setFormError(null);
    try {
      const deletedName = pendingDelete.name;
      await deleteExercise(pendingDelete.id);
      if (editingId === pendingDelete.id) resetForm();
      setPendingDelete(null);
      setFeedback({
        title: 'Ejercicio eliminado',
        message: `«${deletedName}» fue eliminado de tu catálogo.`,
        tone: 'delete',
      });
    } catch (err) {
      setPendingDelete(null);
      setFormError(getErrorMessage(err, 'No se pudo eliminar el ejercicio.'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Day1Button
            label="Volver"
            icon="arrowLeft"
            variant="ghost"
            onPress={() => navigation.goBack()}
          />
        </View>

        <View style={styles.titleBlock}>
          <Day1Text variant="heading26">Mis ejercicios</Day1Text>
          <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
            Crea o edita tus ejercicios personalizados para tus sesiones de gimnasio.
          </Day1Text>
        </View>

        <View
          style={[
            styles.formCard,
            { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
          ]}>
          <View style={styles.formHeaderRow}>
            <Day1ExerciseThumbnail
              muscleGroup={muscleGroup}
              exerciseName={name}
              size={48}
            />
            <View style={styles.formHeaderTexts}>
              <Day1Text variant="bodySemiBold16">
                {editingId !== null ? 'Editar ejercicio' : 'Nuevo ejercicio'}
              </Day1Text>
              <Day1Text variant="labelRegular12" color={colors.textSecondaryReadable}>
                Vista previa de la miniatura según el grupo muscular
              </Day1Text>
            </View>
          </View>

          <Day1TextField
            label="Nombre del ejercicio"
            value={name}
            onChangeText={setName}
            placeholder="Ej: Press inclinado con mancuernas"
            maxLength={100}
          />

          <View style={styles.presetSection}>
            <Day1Text variant="labelMedium14">Grupo muscular</Day1Text>
            <View style={styles.chipsRow}>
              {MUSCLE_GROUP_PRESETS.map((preset) => {
                const selected = muscleGroup.toLowerCase() === preset.label.toLowerCase();
                return (
                  <Pressable
                    key={preset.key}
                    onPress={() => setMuscleGroup(preset.label)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected
                          ? colors.actionPrimary
                          : colors.surfaceSegmented,
                      },
                    ]}>
                    <Day1Text
                      variant={selected ? 'labelSemiBold14' : 'labelRegular14'}
                      color={selected ? colors.textOnAction : colors.textPrimary}>
                      {preset.label}
                    </Day1Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {formError ? <Day1InlineNotice message={formError} /> : null}

          <View style={styles.formActions}>
            {editingId !== null ? (
              <Day1Button label="Cancelar" variant="ghost" onPress={resetForm} />
            ) : null}
            <Day1Button
              label={
                saving
                  ? 'Guardando...'
                  : editingId !== null
                    ? 'Guardar cambios'
                    : 'Crear ejercicio'
              }
              icon={editingId !== null ? 'check' : 'plus'}
              variant="primary"
              onPress={handleSave}
              disabled={saving || !name.trim()}
            />
          </View>
        </View>

        <View style={styles.catalogSection}>
          <Day1Text variant="bodySemiBold16">Catálogo de ejercicios</Day1Text>
          <Day1TextField
            label="Buscar ejercicio"
            value={search}
            onChangeText={setSearch}
            placeholder="Filtrar por nombre o grupo muscular..."
            maxLength={80}
          />

          {error ? (
            <Day1ErrorState message={error} onRetry={reload} compact />
          ) : isLoading ? (
            <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
              Cargando ejercicios...
            </Day1Text>
          ) : filteredExercises.length === 0 ? (
            <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
              No encontramos ejercicios que coincidan con tu búsqueda.
            </Day1Text>
          ) : (
            <View
              style={[
                styles.listCard,
                { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
              ]}>
              {filteredExercises.map((exercise, index) => (
                <View
                  key={exercise.id}
                  style={[
                    styles.row,
                    index < filteredExercises.length - 1 && {
                      borderBottomColor: colors.borderSubtle,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                    },
                  ]}>
                  <Day1ExerciseThumbnail
                    muscleGroup={exercise.muscleGroup}
                    exerciseName={exercise.name}
                    size={42}
                  />
                  <View style={styles.rowTexts}>
                    <Day1Text variant="bodySemiBold16">{exercise.name}</Day1Text>
                    <Day1Text variant="labelRegular12" color={colors.textSecondaryReadable}>
                      {exercise.muscleGroup || 'General'}
                    </Day1Text>
                  </View>

                  {exercise.userId === null ? (
                    <Day1Badge label="Sistema" tone="brand" />
                  ) : (
                    <View style={styles.rowActions}>
                      <Day1Button
                        label="Editar"
                        variant="ghost"
                        onPress={() =>
                          startEdit(exercise.id, exercise.name, exercise.muscleGroup)
                        }
                      />
                      <Day1Button
                        label="Eliminar"
                        variant="ghost"
                        textColor={colors.statusError}
                        onPress={() =>
                          setPendingDelete({ id: exercise.id, name: exercise.name })
                        }
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <Day1ConfirmDeleteModal
        visible={pendingDelete !== null}
        title="¿Eliminar ejercicio?"
        message={
          pendingDelete
            ? `Se eliminará tu ejercicio personalizado "${pendingDelete.name}".`
            : ''
        }
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <Day1FeedbackModal
        visible={feedback !== null}
        title={feedback?.title ?? ''}
        message={feedback?.message}
        tone={feedback?.tone ?? 'success'}
        onClose={() => setFeedback(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[20], gap: Spacing[20], paddingBottom: Spacing[40] },
  header: { flexDirection: 'row' },
  titleBlock: { gap: Spacing[4] },
  formCard: {
    padding: Spacing[16],
    borderRadius: Radius[16],
    borderWidth: 1,
    gap: Spacing[14],
  },
  formHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[12],
  },
  formHeaderTexts: {
    flex: 1,
    gap: 2,
  },
  presetSection: {
    gap: Spacing[8],
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[8],
  },
  chip: {
    paddingHorizontal: Spacing[12],
    paddingVertical: Spacing[8],
    borderRadius: Radius[20],
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing[8],
  },
  catalogSection: {
    gap: Spacing[12],
  },
  listCard: {
    borderRadius: Radius[16],
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[12],
    paddingHorizontal: Spacing[14],
    paddingVertical: Spacing[10],
  },
  rowTexts: {
    flex: 1,
    gap: 2,
  },
  rowActions: {
    flexDirection: 'row',
  },
});
