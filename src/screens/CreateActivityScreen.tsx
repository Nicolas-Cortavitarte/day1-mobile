import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1DateField } from '@/components/atoms/Day1DateField';
import { Day1ReminderField } from '@/components/atoms/Day1ReminderField';
import { Day1Stepper } from '@/components/atoms/Day1Stepper';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1CategoryPicker } from '@/components/molecules/Day1CategoryPicker';
import { Day1InlineNotice } from '@/components/molecules/Day1InlineNotice';
import { Day1RecurrenceEditorModal } from '@/components/molecules/Day1RecurrenceEditorModal';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { Radius, Spacing } from '@/constants/theme';
import { toISODate } from '@/features/activities/dateUtils';
import { DEFAULT_RECURRENCE, recurrenceSummaryLabel, recurrenceToApiPayload, type RecurrenceValue } from '@/features/activities/recurrence';
import { useCategories } from '@/features/activities/useCategories';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateActivity'>;

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function CreateActivityScreen({ navigation }: Props) {
  const colors = useTheme();
  const { categories, isLoading: loadingCategories } = useCategories();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [recurrence, setRecurrence] = useState<RecurrenceValue>(DEFAULT_RECURRENCE);
  const [recurrenceModalVisible, setRecurrenceModalVisible] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState<number | null>(10);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const hasFailedOnce = useRef(false);

  async function handleCreate() {
    if (!categoryId) {
      setError('Elige una categoría.');
      return;
    }
    if (recurrence.frequency === 'WEEKLY_DAYS' && recurrence.daysOfWeek.length === 0) {
      setError('Elige al menos un día de la semana en la repetición.');
      return;
    }

    setSaving(true);
    setError(null);

    const date = toISODate(startDate);
    const timeValue = startTime ? formatTime(startTime) : undefined;

    try {
      if (recurrence.frequency !== 'NONE') {
        await api.post('/activity-recurrences', {
          categoryId,
          title,
          startTime: timeValue,
          durationMinutes: durationMinutes ?? undefined,
          description: description || undefined,
          reminderMinutes: reminderMinutes ?? undefined,
          startDate: date,
          endDate: recurrence.endDate || undefined,
          ...recurrenceToApiPayload(recurrence),
        });
      } else {
        await api.post('/activities', {
          categoryId,
          title,
          scheduledDate: date,
          startTime: timeValue,
          durationMinutes: durationMinutes ?? undefined,
          description: description || undefined,
          reminderMinutes: reminderMinutes ?? undefined,
        });
      }
      
      navigation.goBack();
    } catch (err) {
      hasFailedOnce.current = true;
      setError(err instanceof Error ? err.message : 'No se pudo crear la actividad.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Day1Button label="← Volver" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <View style={styles.titleBlock}>
          <Day1Text variant="heading26">Un nuevo paso</Day1Text>
          <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
            Haz espacio para lo que te hace bien.
          </Day1Text>
        </View>

        {error ? (
          <Day1InlineNotice
            title="No pudimos guardar tu actividad"
            message="Conservamos lo que escribiste. Revisa tu conexión y vuelve a intentarlo."
          />
        ) : null}

        <Day1TextField
          label="Nombre de actividad"
          value={title}
          onChangeText={setTitle}
          placeholder="Ej: Estudiar inglés"
        />

        <View style={styles.block}>
          <Day1Text variant="labelMedium14">Categoría</Day1Text>
          {loadingCategories ? (
            <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
              Cargando categorías...
            </Day1Text>
          ) : (
            <Day1CategoryPicker categories={categories} selectedCategoryId={categoryId} onSelect={setCategoryId} />
          )}
        </View>

        <View style={styles.row}>
          <Day1DateField
            label="Fecha de inicio"
            mode="date"
            value={startDate}
            onChange={setStartDate}
            minimumDate={new Date()}
          />
          <Day1DateField label="Hora opcional" mode="time" value={startTime} onChange={setStartTime} />
        </View>

        <View style={styles.block}>
          <Day1Text variant="labelMedium14">Duración opcional</Day1Text>
          {durationMinutes === null ? (
            <Pressable
              onPress={() => setDurationMinutes(20)}
              style={[styles.navRow, { backgroundColor: colors.surfaceCard, borderColor: colors.borderControl }]}>
              <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
                Sin definir
              </Day1Text>
              <Day1Text variant="bodyRegular16">⏱️</Day1Text>
            </Pressable>
          ) : (
            <View style={[styles.durationRow, { backgroundColor: colors.surfaceCard, borderColor: colors.borderControl }]}>
              <Day1Stepper value={durationMinutes} onChange={setDurationMinutes} suffix="min" min={5} max={240} step={5} />
              <Pressable onPress={() => setDurationMinutes(null)}>
                <Day1Text variant="labelMedium14" color={colors.statusError}>
                  Quitar
                </Day1Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.block}>
          <Day1Text variant="labelMedium14">Repetición</Day1Text>
          <Pressable
            onPress={() => setRecurrenceModalVisible(true)}
            style={[styles.navRow, { backgroundColor: colors.surfaceCard, borderColor: colors.borderControl }]}>
            <Day1Text variant="bodyRegular16">{recurrenceSummaryLabel(recurrence)}</Day1Text>
            <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
              ›
            </Day1Text>
          </Pressable>
        </View>

        <Day1ReminderField label="Recordatorio opcional" value={reminderMinutes} onChange={setReminderMinutes} />

        <Day1TextField
          label="Descripción opcional"
          value={description}
          onChangeText={setDescription}
          placeholder="Practicar conversación durante 20 minutos."
          multiline
          numberOfLines={3}
          style={styles.descriptionInput}
        />

        <Day1Text variant="labelRegular12" color={colors.textSecondaryReadable}>
          Si no eliges una hora, aparecerá en «A tu ritmo».
        </Day1Text>

        <Day1Button
          label={saving ? 'Guardando...' : hasFailedOnce.current ? 'Volver a intentar' : 'Guardar actividad'}
          variant="primary"
          onPress={handleCreate}
          disabled={saving || !title || !categoryId}
        />
      </ScrollView>

      <Day1RecurrenceEditorModal
        visible={recurrenceModalVisible}
        activityTitle={title}
        initialValue={recurrence}
        startDate={toISODate(startDate)}
        startTime={startTime ? formatTime(startTime) : null}
        onApply={(value) => {
          setRecurrence(value);
          setRecurrenceModalVisible(false);
        }}
        onClose={() => setRecurrenceModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[24], gap: Spacing[20], paddingBottom: Spacing[40] },
  header: { flexDirection: 'row' },
  titleBlock: { gap: Spacing[6] },
  block: { gap: Spacing[8] },
  row: { flexDirection: 'row', gap: Spacing[12] },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: Spacing[12],
    borderRadius: Radius[12],
    borderWidth: 1,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: Spacing[12],
    borderRadius: Radius[12],
    borderWidth: 1,
  },
  descriptionInput: { minHeight: 80, textAlignVertical: 'top' },
});