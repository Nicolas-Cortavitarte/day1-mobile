import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1CategoryDot } from '@/components/atoms/Day1CategoryDot';
import { Day1Text } from '@/components/atoms/Day1Text';
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

  async function handleDelete(id: number) {
    try {
      await deleteCategory(id);
      if (editingId === id) resetForm();
    } catch (err) {
      Alert.alert('No se pudo eliminar', getErrorMessage(err, 'Inténtalo de nuevo.'));
    }
  }

  function confirmDelete(id: number, categoryName: string) {
    Alert.alert('Eliminar categoría', `¿Seguro que quieres eliminar "${categoryName}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => handleDelete(id) },
    ]);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Day1Button label="Volver" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <Day1Text variant="heading26">Mis categorías</Day1Text>

        {error ? (
          <View style={styles.errorBlock}>
            <Day1Text variant="labelRegular14" color={colors.statusError}>{error}</Day1Text>
            <Day1Button label="Reintentar" variant="secondary" onPress={reload} />
          </View>
        ) : isLoading ? (
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>Cargando...</Day1Text>
        ) : (
          categories.map((category) => (
            <View key={category.id} style={[styles.row, { borderColor: colors.borderSubtle }]}>
              <Day1CategoryDot color={category.color} />
              <Day1Text variant="bodyRegular16" style={styles.rowLabel}>{category.name}</Day1Text>
              {category.userId === null ? (
                <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>Sistema</Day1Text>
              ) : (
                <View style={styles.rowActions}>
                  <Day1Button label="Editar" variant="ghost" onPress={() => startEdit(category.id, category.name, category.color)} />
                  <Day1Button label="Eliminar" variant="ghost" onPress={() => confirmDelete(category.id, category.name)} />
                </View>
              )}
            </View>
          ))
        )}

        <Day1Text variant="bodySemiBold16" style={styles.sectionSpacing}>
          {editingId !== null ? 'Editar categoría' : 'Nueva categoría'}
        </Day1Text>

        <Day1TextField
          label="Nombre"
          value={name}
          onChangeText={setName}
          placeholder="Ej: Lectura"
          maxLength={50}
        />

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

        {formError ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>{formError}</Day1Text>
        ) : null}

        <View style={styles.formActions}>
          {editingId !== null ? (
            <Day1Button label="Cancelar edición" variant="ghost" onPress={resetForm} />
          ) : null}
          <Day1Button
            label={saving ? 'Guardando...' : editingId !== null ? 'Guardar cambios' : 'Crear categoría'}
            variant="primary"
            onPress={handleSave}
            disabled={saving || !name.trim()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[16], gap: Spacing[12] },
  header: { flexDirection: 'row' },
  errorBlock: { gap: Spacing[8] },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing[8],
    paddingVertical: Spacing[8], borderBottomWidth: 1,
  },
  rowLabel: { flex: 1 },
  rowActions: { flexDirection: 'row' },
  sectionSpacing: { marginTop: Spacing[16] },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[8] },
  swatch: { width: 36, height: 36, borderRadius: Radius[18], borderWidth: 2, padding: 0 },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing[8] },
});
