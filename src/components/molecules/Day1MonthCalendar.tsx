import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Day1Icon } from '@/components/atoms/Day1Icon';
import { Day1Text } from '@/components/atoms/Day1Text';
import { useTheme } from '@/hooks/use-theme';
import { MinTouchTarget, Radius, Spacing } from '@/constants/theme';
import {
  addMonths,
  dayNumber,
  getMonthGrid,
  monthYearLabel,
  startOfMonth,
  todayISODate,
} from '@/features/activities/dateUtils';

type Props = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  minimumDate?: string;
};

const WEEKDAY_HEADERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export function Day1MonthCalendar({ selectedDate, onSelectDate, minimumDate }: Props) {
  const colors = useTheme();
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selectedDate));
  const today = todayISODate();

  useEffect(() => {
    setVisibleMonth(startOfMonth(selectedDate));
  }, [selectedDate]);

  const weeks = getMonthGrid(visibleMonth).filter((week) => week.some((cell) => cell !== null));

  function handleChangeMonth(delta: number) {
    const nextMonth = startOfMonth(addMonths(visibleMonth, delta));
    setVisibleMonth(nextMonth);
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => handleChangeMonth(-1)}
          accessibilityRole="button"
          accessibilityLabel="Mes anterior"
          style={[styles.navButton, { backgroundColor: colors.surfaceSegmented }]}>
          <Day1Icon name="chevronLeft" size={20} color={colors.textPrimary} />
        </Pressable>

        <Day1Text variant="bodySemiBold16" color={colors.textPrimary} style={styles.monthLabel}>
          {monthYearLabel(visibleMonth)}
        </Day1Text>

        <Pressable
          onPress={() => handleChangeMonth(1)}
          accessibilityRole="button"
          accessibilityLabel="Mes siguiente"
          style={[styles.navButton, { backgroundColor: colors.surfaceSegmented }]}>
          <Day1Icon name="chevronRight" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAY_HEADERS.map((label, index) => (
          <Day1Text
            key={index}
            variant="labelMedium12"
            color={colors.textSecondaryReadable}
            style={[styles.cell, styles.centerText]}>
            {label}
          </Day1Text>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {week.map((date, dayIndex) => {
            if (!date) {
              return <View key={dayIndex} style={styles.cell} />;
            }

            const isSelected = date === selectedDate;
            const isToday = date === today;
            const isDisabled = !!minimumDate && date < minimumDate;

            return (
              <Pressable
                key={date}
                disabled={isDisabled}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected, disabled: isDisabled }}
                onPress={() => onSelectDate(date)}
                style={[
                  styles.cell,
                  styles.dayCell,
                  {
                    backgroundColor: isSelected
                      ? colors.actionPrimary
                      : isToday
                        ? colors.surfaceBrandSoft
                        : 'transparent',
                    borderColor: isToday && !isSelected ? colors.actionPrimary : 'transparent',
                    opacity: isDisabled ? 0.35 : 1,
                  },
                ]}>
                <Day1Text
                  variant={isSelected || isToday ? 'labelSemiBold14' : 'labelRegular14'}
                  color={
                    isSelected
                      ? colors.textOnAction
                      : isToday
                        ? colors.actionPressed
                        : colors.textPrimary
                  }>
                  {dayNumber(date)}
                </Day1Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius[16],
    borderWidth: 1,
    paddingHorizontal: Spacing[12],
    paddingVertical: Spacing[10],
    gap: Spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing[6],
  },
  navButton: {
    width: MinTouchTarget - 6,
    height: MinTouchTarget - 6,
    borderRadius: Radius[12],
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    textTransform: 'capitalize',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[8],
  },
  centerText: {
    textAlign: 'center',
  },
  dayCell: {
    borderRadius: Radius[12],
    borderWidth: 1,
    marginHorizontal: 1,
  },
});
