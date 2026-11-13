import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1DateField } from '@/components/atoms/Day1DateField';
import { Day1Icon } from '@/components/atoms/Day1Icon';
import { Day1KeyboardScrollView } from '@/components/atoms/Day1KeyboardScrollView';
import { Day1ReminderField } from '@/components/atoms/Day1ReminderField';
import { Day1Stepper } from '@/components/atoms/Day1Stepper';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1CategoryPicker } from '@/components/molecules/Day1CategoryPicker';
import { Day1FeedbackModal } from '@/components/molecules/Day1FeedbackModal';
import { Day1InlineNotice } from '@/components/molecules/Day1InlineNotice';
import { Day1RecurrenceEditorModal } from '@/components/molecules/Day1RecurrenceEditorModal';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { Radius, Spacing } from '@/constants/theme';
import { parseISODate, toISODate, todayISODate } from '@/features/activities/dateUtils';
import {
  DEFAULT_RECURRENCE,
  recurrenceSummaryLabel,
  recurrenceToApiPayload,
  type RecurrenceValue,
} from '@/features/activities/recurrence';
import { useCategories } from '@/features/activities/useCategories';
import { getErrorMessage } from '@/lib/errors';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateActivity'>;

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function CreateActivityScreen({ route, navigation }: Props) {
  const colors = useTheme();
  const { categories, isLoading: loadingCategories, error: categoriesError, reload: reloadCategories } =
    useCategories();

  const initialDateParam = route.params?.initialDate;
  const initialDateObj =
    initialDateParam && initialDateParam >= todayISODate()
      ? parseISODate(initialDateParam)
      : new Date();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date>(initialDateObj);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [recurrence, setRecurrence] = useState<RecurrenceValue>(DEFAULT_RECURRENCE);
  const [recurrenceModalVisible, setRecurrenceModalVisible] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState<number | null>(10);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [createdTitle, setCreatedTitle] = useState<string | null>(null);
  const hasFailedOnce = useRef(false);

  function handleChangeStartTime(nextTime: Date) {
    setStartTime(nextTime);
    setError(null);
  }

  function handleClearStartTime() {
    setStartTime(null);
    setDurationMinutes(null);
    setError(null);
  }

  function handleEnableDuration() {
    if (!startTime) {
      setError('Elige primero una hora de inicio para definir la duración.');
      return;
    }
    setError(null);
    setDurationMinutes(20);
  }

  async function handleCreate() {
    if (saving) return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Escribe el nombre de la actividad.');
      return;
    }
    if (!categoryId) {
      setError('Elige una categoría.');
      return;
    }
    if (durationMinutes !== null && !startTime) {
      setError('La duración requiere una hora de inicio.');
      return;
    }
    if (recurrence.frequency === 'WEEKLY_DAYS' && recurrence.daysOfWeek.length === 0) {
      setError('Elige al menos un día de la semana en la repetición.');
      return;
    }

    const date = toISODate(startDate);
    if (recurrence.endDate && recurrence.endDate < date) {
      setError('La fecha de finalización no puede ser anterior a la fecha de inicio.');
      return;
    }

    setSaving(true);
    setError(null);

    const timeValue = startTime ? formatTime(startTime) : undefined;
    const trimmedDescription = description.trim() || undefined;

    try {
      if (recurrence.frequency !== 'NONE') {
        await api.post('/activity-recurrences', {
          categoryId,
          title: trimmedTitle,
          startTime: timeValue,
          durationMinutes: durationMinutes ?? undefined,
          description: trimmedDescription,
          reminderMinutes: reminderMinutes ?? undefined,
          startDate: date,
          endDate: recurrence.endDate || undefined,
          ...recurrenceToApiPayload(recurrence),
        });
      } else {
        await api.post('/activities', {
          categoryId,
          title: trimmedTitle,
          scheduledDate: date,
          startTime: timeValue,
          durationMinutes: durationMinutes ?? undefined,
          description: trimmedDescription,
          reminderMinutes: reminderMinutes ?? undefined,
        });
      }

      setCreatedTitle(trimmedTitle);
    } catch (err) {
      hasFailedOnce.current = true;
      setError(getErrorMessage(err, 'No se pudo crear la actividad.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <Day1KeyboardScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Day1Button label="Volver" icon="arrowLeft" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <View style={styles.titleBlock}>
          <Day1Text variant="heading26">Un nuevo paso</Day1Text>
          <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
            Haz espacio para lo que te hace bien.
          </Day1Text>
        </View>

        {error ? (
          <Day1InlineNotice title="No pudimos guardar tu actividad" message={error} />
        ) : null}

        <Day1TextField
          label="Nombre de actividad"
          value={title}
          onChangeText={setTitle}
          placeholder="Ej: Estudiar inglés"
          maxLength={120}
        />

        <View style={styles.block}>
          <Day1Text variant="labelMedium14">Categoría</Day1Text>
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
        </View>

        <View style={styles.row}>
          <Day1DateField
            label="Fecha de inicio"
            mode="date"
            value={startDate}
            onChange={setStartDate}
            minimumDate={new Date()}
          />
          <Day1DateField
            label="Hora opcional"
            mode="time"
            value={startTime}
            onChange={handleChangeStartTime}
            onClear={handleClearStartTime}
          />
        </View>

        <View style={styles.block}>
          <Day1Text variant="labelMedium14">Duración opcional</Day1Text>
          {durationMinutes === null ? (
            <Pressable
              onPress={handleEnableDuration}
              accessibilityRole="button"
              accessibilityLabel="Definir duración"
              style={[styles.navRow, { backgroundColor: colors.surfaceCard, borderColor: colors.borderControl }]}>
              <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
                Sin definir
              </Day1Text>
              <Day1Icon name="timer" size={20} color={colors.textSecondaryReadable} />
            </Pressable>
          ) : (
            <View style={[styles.durationRow, { backgroundColor: colors.surfaceCard, borderColor: colors.borderControl }]}>
              <Day1Stepper value={durationMinutes} onChange={setDurationMinutes} suffix="min" min={5} max={240} step={5} />
              <Pressable onPress={() => setDurationMinutes(null)} hitSlop={10}>
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
            accessibilityRole="button"
            accessibilityLabel={`Repetición: ${recurrenceSummaryLabel(recurrence)}`}
            style={[styles.navRow, { backgroundColor: colors.surfaceCard, borderColor: colors.borderControl }]}>
            <Day1Text variant="bodyRegular16">{recurrenceSummaryLabel(recurrence)}</Day1Text>
            <Day1Icon name="chevronRight" size={20} color={colors.textSecondaryReadable} />
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
          maxLength={1000}
          style={styles.descriptionInput}
        />

        <Day1Text variant="labelRegular12" color={colors.textSecondaryReadable}>
          Si no eliges una hora, aparecerá en «A tu ritmo».
        </Day1Text>

        <Day1Button
          label={saving ? 'Guardando...' : hasFailedOnce.current ? 'Volver a intentar' : 'Guardar actividad'}
          variant="primary"
          onPress={handleCreate}
          disabled={saving || !title.trim() || !categoryId}
        />
      </Day1KeyboardScrollView>

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

      <Day1FeedbackModal
        visible={createdTitle !== null}
        title="¡Actividad creada!"
        message={
          createdTitle ? `«${createdTitle}» ya está agendada en tu plan.` : undefined
        }
        onClose={() => {
          setCreatedTitle(null);
          navigation.goBack();
        }}
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
