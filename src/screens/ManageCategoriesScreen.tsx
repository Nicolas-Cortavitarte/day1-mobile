import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1CategoryDot } from '@/components/atoms/Day1CategoryDot';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1ConfirmDeleteModal } from '@/components/molecules/Day1ConfirmDeleteModal';
import { Day1ErrorState } from '@/components/molecules/Day1ErrorState';
import { Day1InlineNotice } from '@/components/molecules/Day1InlineNotice';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { Spacing, Radius } from '@/constants/theme';
import { useManageCategories } from '@/features/activities/useManageCategories';
import { getErrorMessage } from '@/lib/errors';
import { useTheme } from '@/hooks/use-theme';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'ManageCategories'>;

const COLOR_SWATCHES = ['#B7D9BD', '#F4C77B', '#E29C9C', '#9CC1E2', '#C9A6E2', '#E2B89C', '#9CE2C4', '#D1D1D1'];

export function ManageCategoriesScreen({ navigation }: Props) {
  const colors = useTheme();
  const { categories, isLoading, error, reload, createCategory, updateCategory, deleteCategory } =
    useManageCategories();

  const [name, setName] = useState('');
  const [color, setColor] = useState(COLOR_SWATCHES[0]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  function startEdit(id: number, currentName: string, currentColor: string) {
    setEditingId(id);
    setName(currentName);
    setColor(currentColor);
    setFormError(null);
  }

  function resetForm() {
    setEditingId(null);
    setName('');
    setColor(COLOR_SWATCHES[0]);
    setFormError(null);
  }

  async function handleSave() {
    if (saving || !name.trim()) return;
    setSaving(true);
    setFormError(null);
    try {
      if (editingId !== null) {
        await updateCategory(editingId, { name, color });
      } else {
        await createCategory(name, color);
      }
      resetForm();
    } catch (err) {
      setFormError(getErrorMessage(err, 'No se pudo guardar la categoría.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    setFormError(null);
    try {
      await deleteCategory(pendingDelete.id);
      if (editingId === pendingDelete.id) resetForm();
      setPendingDelete(null);
    } catch (err) {
      setPendingDelete(null);
      setFormError(getErrorMessage(err, 'No se pudo eliminar la categoría.'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Day1Button label="Volver" icon="arrowLeft" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <Day1Text variant="heading26">Mis categorías</Day1Text>

        {error ? (
          <Day1ErrorState message={error} onRetry={reload} compact />
        ) : isLoading ? (
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
            Cargando...
          </Day1Text>
        ) : (
          <View style={[styles.listCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
            {categories.map((category, index) => (
              <View
                key={category.id}
                style={[
                  styles.row,
                  index < categories.length - 1 && {
                    borderBottomColor: colors.borderSubtle,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                  },
                ]}>
                <Day1CategoryDot color={category.color} />
                <Day1Text variant="bodyRegular16" style={styles.rowLabel}>
                  {category.name}
                </Day1Text>
                {category.userId === null ? (
                  <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                    Sistema
                  </Day1Text>
                ) : (
                  <View style={styles.rowActions}>
                    <Day1Button
                      label="Editar"
                      variant="ghost"
                      onPress={() => startEdit(category.id, category.name, category.color)}
                    />
                    <Day1Button
                      label="Eliminar"
                      variant="ghost"
                      textColor={colors.statusError}
                      onPress={() => setPendingDelete({ id: category.id, name: category.name })}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={[styles.formCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
          <Day1Text variant="bodySemiBold16">
            {editingId !== null ? 'Editar categoría' : 'Nueva categoría'}
          </Day1Text>

          <Day1TextField
            label="Nombre"
            value={name}
            onChangeText={setName}
            placeholder="Ej: Lectura"
            maxLength={50}
          />

          <View style={styles.swatchSection}>
            <Day1Text variant="labelMedium14">Color</Day1Text>
            <View style={styles.swatchRow}>
              {COLOR_SWATCHES.map((swatch) => (
                <Day1Button
                  key={swatch}
                  label=""
                  variant="ghost"
                  onPress={() => setColor(swatch)}
                  style={{
                    ...styles.swatch,
                    backgroundColor: swatch,
                    borderColor: swatch === color ? colors.textPrimary : 'transparent',
                  }}
                />
              ))}
            </View>
          </View>

          {formError ? <Day1InlineNotice message={formError} /> : null}

          <View style={styles.formActions}>
            {editingId !== null ? (
              <Day1Button label="Cancelar" variant="ghost" onPress={resetForm} />
            ) : null}
            <Day1Button
              label={saving ? 'Guardando...' : editingId !== null ? 'Guardar cambios' : 'Crear categoría'}
              variant="primary"
              onPress={handleSave}
              disabled={saving || !name.trim()}
            />
          </View>
        </View>
      </ScrollView>

      <Day1ConfirmDeleteModal
        visible={pendingDelete !== null}
        title="¿Eliminar categoría?"
        message={
          pendingDelete
            ? `Se eliminará la categoría "${pendingDelete.name}".`
            : ''
        }
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[20], gap: Spacing[16], paddingBottom: Spacing[40] },
  header: { flexDirection: 'row' },
  listCard: { borderRadius: Radius[16], borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[10],
    paddingHorizontal: Spacing[14],
    paddingVertical: Spacing[8],
  },
  rowLabel: { flex: 1 },
  rowActions: { flexDirection: 'row' },
  formCard: {
    padding: Spacing[16],
    borderRadius: Radius[16],
    borderWidth: 1,
    gap: Spacing[14],
  },
  swatchSection: { gap: Spacing[8] },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[10] },
  swatch: { width: 44, height: 44, borderRadius: Radius[22], borderWidth: 2, padding: 0 },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing[8] },
});
