import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1DateField } from '@/components/atoms/Day1DateField';
import { Day1Stepper } from '@/components/atoms/Day1Stepper';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1RadioRow } from '@/components/molecules/Day1RadioRow';
import { Day1WeekdayPicker } from '@/components/molecules/Day1WeekdayPicker';
import { Radius, Spacing } from '@/constants/theme';
import { parseISODate, toISODate } from '@/features/activities/dateUtils';
import { describeRecurrence, type RecurrenceFrequency, type RecurrenceValue } from '@/features/activities/recurrence';
import { useTheme } from '@/hooks/use-theme';

type Day1RecurrenceEditorModalProps = {
  visible: boolean;
  activityTitle: string;
  initialValue: RecurrenceValue;
  startDate: string;
  startTime: string | null;
  onApply: (value: RecurrenceValue) => void;
  onClose: () => void;
};

const FREQUENCY_OPTIONS: { value: RecurrenceFrequency; label: string }[] = [
  { value: 'NONE', label: 'No repetir' },
  { value: 'DAILY', label: 'Todos los días' },
  { value: 'WEEKLY_DAYS', label: 'Días específicos de la semana' },
  { value: 'CUSTOM_DAYS', label: 'Cada N días' },
];

export function Day1RecurrenceEditorModal({
  visible,
  activityTitle,
  initialValue,
  startDate,
  startTime,
  onApply,
  onClose,
}: Day1RecurrenceEditorModalProps) {
  const colors = useTheme();

  const [frequency, setFrequency] = useState<RecurrenceFrequency>(initialValue.frequency);
  const [daysOfWeek, setDaysOfWeek] = useState(initialValue.daysOfWeek);
  const [intervalDays, setIntervalDays] = useState(initialValue.intervalDays);
  const [endDate, setEndDate] = useState<string | null>(initialValue.endDate);

  useEffect(() => {
    if (visible) {
      setFrequency(initialValue.frequency);
      setDaysOfWeek(initialValue.daysOfWeek);
      setIntervalDays(initialValue.intervalDays);
      setEndDate(initialValue.endDate);
    }
  }, [visible, initialValue]);

  function toggleDay(day: number) {
    setDaysOfWeek((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  const value: RecurrenceValue = { frequency, daysOfWeek, intervalDays, endDate };
  const preview = describeRecurrence(value, startDate, startTime);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Day1Button label="← Volver" variant="ghost" onPress={onClose} />
          </View>

          <View style={styles.titleBlock}>
            <Day1Text variant="heading26">Dale tu ritmo</Day1Text>
            <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
              {activityTitle || 'Nueva actividad'} · Repetición
            </Day1Text>
          </View>

          <View style={[styles.optionsCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
            {FREQUENCY_OPTIONS.map((option, index) => (
              <Day1RadioRow
                key={option.value}
                label={option.label}
                selected={frequency === option.value}
                onPress={() => setFrequency(option.value)}
                isLast={index === FREQUENCY_OPTIONS.length - 1}
              />
            ))}
          </View>

          {frequency === 'WEEKLY_DAYS' ? (
            <View style={styles.block}>
              <Day1Text variant="labelMedium14">Repetir los días</Day1Text>
              <Day1WeekdayPicker selectedDays={daysOfWeek} onToggleDay={toggleDay} />
            </View>
          ) : null}

          <Day1DateField
            label="Fecha de finalización opcional"
            mode="date"
            value={endDate ? parseISODate(endDate) : null}
            onChange={(date) => setEndDate(toISODate(date))}
            placeholder="Sin fecha de fin"
            minimumDate={parseISODate(startDate)}
          />

          <View style={[styles.previewCard, { backgroundColor: colors.surfaceBrandSoft }]}>
            <Day1Text variant="labelRegular14" color={colors.textPrimary}>
              {preview}
            </Day1Text>
          </View>

          <Day1Button label="Aplicar repetición" variant="primary" onPress={() => onApply(value)} />

          <View style={styles.stepperBlock}>
            <Day1Text variant="labelSemiBold12" color={colors.textSecondaryReadable}>
              AL ELEGIR «CADA N DÍAS»
            </Day1Text>
            <View style={styles.stepperRow}>
              <Day1Text variant="bodyRegular16">Repetir cada</Day1Text>
              <Day1Stepper
                value={intervalDays}
                onChange={setIntervalDays}
                suffix={intervalDays === 1 ? 'día' : 'días'}
                min={1}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[24], gap: Spacing[20], paddingBottom: Spacing[40] },
  header: { flexDirection: 'row' },
  titleBlock: { gap: Spacing[6] },
  optionsCard: { borderRadius: Radius[16], borderWidth: 1, overflow: 'hidden' },
  block: { gap: Spacing[10] },
  previewCard: { borderRadius: Radius[14], padding: Spacing[14] },
  stepperBlock: { gap: Spacing[10] },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});