import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { MinTouchTarget, Radius, Spacing } from '@/constants/theme';
import { longDateLabel, parseISODate, toISODate } from '@/features/activities/dateUtils';
import { Day1MonthCalendar } from '@/components/molecules/Day1MonthCalendar';
import { Day1Text } from './Day1Text';
import { Day1Button } from './Day1Button';
import { Day1Icon } from './Day1Icon';

type Day1DateFieldProps = {
  label: string;
  mode: 'date' | 'time';
  value: Date | null;
  onChange: (date: Date) => void;
  onClear?: () => void;
  placeholder?: string;
  minimumDate?: Date;
  errorBorder?: boolean;
  style?: object;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTE_STEPS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
const TIME_ROW_STEP = 48;

function formatValue(value: Date | null, mode: 'date' | 'time') {
  if (!value) return null;
  if (mode === 'time') {
    const h = String(value.getHours()).padStart(2, '0');
    const m = String(value.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }
  const formatted = value.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return formatted.replace('.', '');
}

export function Day1DateField({
  label,
  mode,
  value,
  onChange,
  onClear,
  placeholder,
  minimumDate,
  errorBorder,
  style,
}: Day1DateFieldProps) {
  const colors = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const hourScrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const minuteScrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [draftDateISO, setDraftDateISO] = useState(() => toISODate(value ?? new Date()));
  const [draftHour, setDraftHour] = useState(() => (value ? value.getHours() : 0));
  const [draftMinute, setDraftMinute] = useState(() => {
    if (!value) return 0;
    const rounded = Math.round(value.getMinutes() / 5) * 5;
    return rounded >= 60 ? 55 : rounded;
  });

  useEffect(() => {
    if (value) {
      setDraftDateISO(toISODate(value));
      setDraftHour(value.getHours());
      const rounded = Math.round(value.getMinutes() / 5) * 5;
      setDraftMinute(rounded >= 60 ? 55 : rounded);
    }
  }, [value]);

  function openPicker() {
    const base = value ?? minimumDate ?? new Date();
    const nextHour = value ? value.getHours() : 0;
    const rounded = value ? Math.round(value.getMinutes() / 5) * 5 : 0;
    const nextMinute = rounded >= 60 ? 55 : rounded;

    setDraftDateISO(toISODate(base));
    setDraftHour(nextHour);
    setDraftMinute(nextMinute);
    setModalOpen(true);

    if (mode === 'time') {
      setTimeout(() => {
        const hourIndex = HOURS.indexOf(nextHour);
        if (hourIndex >= 0) {
          hourScrollRef.current?.scrollTo({
            y: Math.max(0, (hourIndex - 1) * TIME_ROW_STEP),
            animated: true,
          });
        }
        const minuteIndex = MINUTE_STEPS.indexOf(nextMinute);
        if (minuteIndex >= 0) {
          minuteScrollRef.current?.scrollTo({
            y: Math.max(0, (minuteIndex - 1) * TIME_ROW_STEP),
            animated: true,
          });
        }
      }, 60);
    }
  }

  function handleConfirm() {
    if (mode === 'date') {
      onChange(parseISODate(draftDateISO));
    } else {
      const next = value ? new Date(value) : new Date();
      next.setHours(draftHour, draftMinute, 0, 0);
      onChange(next);
    }
    setModalOpen(false);
  }

  const display = formatValue(value, mode);
  const fallbackText = placeholder ?? (mode === 'date' ? 'Elegir fecha' : 'Elegir hora');
  const minDateISO = minimumDate ? toISODate(minimumDate) : undefined;

  return (
    <View style={[styles.field, style]}>
      <View style={styles.labelRow}>
        <Day1Text variant="labelMedium14">{label}</Day1Text>
        {value && onClear ? (
          <Pressable
            onPress={onClear}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={`Quitar ${label.toLowerCase()}`}>
            <Day1Text variant="labelRegular12" color={colors.statusError}>
              Quitar
            </Day1Text>
          </Pressable>
        ) : null}
      </View>

      <Pressable
        onPress={openPicker}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${display ?? fallbackText}`}
        style={[
          styles.shell,
          {
            backgroundColor: colors.surfaceCard,
            borderColor: errorBorder
              ? colors.statusError
              : modalOpen
                ? colors.actionPrimary
                : colors.borderControl,
          },
        ]}>
        <Day1Text
          variant="bodyRegular16"
          color={display ? colors.textPrimary : colors.textSecondaryReadable}>
          {display ?? fallbackText}
        </Day1Text>
        <Day1Icon
          name={mode === 'date' ? 'calendar' : 'clock'}
          size={20}
          color={modalOpen ? colors.actionPrimary : colors.textSecondaryReadable}
        />
      </Pressable>

      <Modal
        visible={modalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setModalOpen(false)}>
        <Pressable style={[styles.backdrop, { backgroundColor: colors.surfaceScrim }]} onPress={() => setModalOpen(false)}>
          <Pressable
            style={[
              styles.sheet,
              {
                backgroundColor: colors.backgroundDefault,
                borderColor: colors.borderSubtle,
              },
            ]}
            onPress={() => { }}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetTitleGroup}>
                <Day1Text variant="section20">{label}</Day1Text>
                <Day1Text variant="labelRegular13" color={colors.textSecondaryReadable} style={styles.capitalize}>
                  {mode === 'date'
                    ? longDateLabel(draftDateISO)
                    : `${String(draftHour).padStart(2, '0')}:${String(draftMinute).padStart(2, '0')} hrs`}
                </Day1Text>
              </View>
              <View style={[styles.previewBadge, { backgroundColor: colors.surfaceBrandSoft }]}>
                <Day1Icon
                  name={mode === 'date' ? 'calendar' : 'clock'}
                  size={16}
                  color={colors.actionPressed}
                />
                <Day1Text variant="labelSemiBold14" color={colors.actionPressed}>
                  {mode === 'date'
                    ? draftDateISO.split('-').reverse().join('/')
                    : `${String(draftHour).padStart(2, '0')}:${String(draftMinute).padStart(2, '0')}`}
                </Day1Text>
              </View>
            </View>

            {mode === 'date' ? (
              <Day1MonthCalendar
                selectedDate={draftDateISO}
                onSelectDate={setDraftDateISO}
                minimumDate={minDateISO}
              />
            ) : (
              <View
                style={[
                  styles.timeCard,
                  { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
                ]}>
                <View style={styles.timeColumn}>
                  <Day1Text
                    variant="labelMedium13"
                    color={colors.textSecondaryReadable}
                    style={styles.columnHeader}>
                    Hora
                  </Day1Text>
                  <ScrollView
                    ref={hourScrollRef}
                    style={styles.timeScroll}
                    contentContainerStyle={styles.timeGrid}
                    showsVerticalScrollIndicator={false}>
                    {HOURS.map((hour) => {
                      const selected = hour === draftHour;
                      return (
                        <Pressable
                          key={hour}
                          onPress={() => setDraftHour(hour)}
                          style={[
                            styles.timePill,
                            {
                              backgroundColor: selected
                                ? colors.actionPrimary
                                : colors.surfaceSegmented,
                            },
                          ]}>
                          <Day1Text
                            variant={selected ? 'labelSemiBold14' : 'labelRegular14'}
                            color={selected ? colors.textOnAction : colors.textPrimary}>
                            {String(hour).padStart(2, '0')}
                          </Day1Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />

                <View style={styles.timeColumn}>
                  <Day1Text
                    variant="labelMedium13"
                    color={colors.textSecondaryReadable}
                    style={styles.columnHeader}>
                    Minutos
                  </Day1Text>
                  <ScrollView
                    ref={minuteScrollRef}
                    style={styles.timeScroll}
                    contentContainerStyle={styles.timeGrid}
                    showsVerticalScrollIndicator={false}>
                    {MINUTE_STEPS.map((minute) => {
                      const selected = minute === draftMinute;
                      return (
                        <Pressable
                          key={minute}
                          onPress={() => setDraftMinute(minute)}
                          style={[
                            styles.timePill,
                            {
                              backgroundColor: selected
                                ? colors.actionPrimary
                                : colors.surfaceSegmented,
                            },
                          ]}>
                          <Day1Text
                            variant={selected ? 'labelSemiBold14' : 'labelRegular14'}
                            color={selected ? colors.textOnAction : colors.textPrimary}>
                            {String(minute).padStart(2, '0')}
                          </Day1Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            )}

            <View style={styles.actionsRow}>
              <Day1Button
                label="Cancelar"
                variant="secondary"
                style={styles.flex}
                onPress={() => setModalOpen(false)}
              />
              <Day1Button
                label="Confirmar"
                variant="primary"
                style={styles.flex}
                onPress={handleConfirm}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6, flex: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MinTouchTarget + 8,
    paddingHorizontal: 14,
    paddingVertical: Spacing[12],
    borderRadius: Radius[12],
    borderWidth: 1,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing[20],
  },
  sheet: {
    padding: Spacing[20],
    gap: Spacing[16],
    borderRadius: Radius[24],
    borderWidth: 1,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing[12],
  },
  sheetTitleGroup: {
    flex: 1,
    gap: 2,
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[6],
    paddingHorizontal: Spacing[12],
    paddingVertical: Spacing[8],
    borderRadius: Radius[14],
  },
  timeCard: {
    flexDirection: 'row',
    borderRadius: Radius[16],
    borderWidth: 1,
    padding: Spacing[12],
    gap: Spacing[12],
    maxHeight: 240,
  },
  timeColumn: {
    flex: 1,
    gap: Spacing[8],
  },
  columnHeader: {
    textAlign: 'center',
  },
  timeScroll: {
    flexGrow: 0,
  },
  timeGrid: {
    gap: Spacing[8],
  },
  timePill: {
    width: '100%',
    minHeight: 40,
    borderRadius: Radius[12],
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing[10],
  },
  flex: {
    flex: 1,
  },
});
