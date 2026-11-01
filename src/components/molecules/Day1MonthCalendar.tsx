import { Pressable, StyleSheet, View } from 'react-native';

import { Day1Text } from '@/components/atoms/Day1Text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Radius } from '@/constants/theme';
import { dayNumber, addMonths, getMonthGrid, monthYearLabel } from '@/features/activities/dateUtils';

type Props = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

const WEEKDAY_HEADERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export function Day1MonthCalendar({ selectedDate, onSelectDate }: Props) {
  const colors = useTheme();
  const weeks = getMonthGrid(selectedDate);

  return (
    <View>
      <View style={styles.header}>
        <Pressable onPress={() => onSelectDate(addMonths(selectedDate, -1))} hitSlop={12}>
          <Day1Text variant="heading28" color={colors.textPrimary}>‹</Day1Text>
        </Pressable>
        <Day1Text variant="labelRegular14" color={colors.textPrimary} style={styles.monthLabel}>
          {monthYearLabel(selectedDate)}
        </Day1Text>
        <Pressable onPress={() => onSelectDate(addMonths(selectedDate, -1))} hitSlop={12}>
          <Day1Text variant="heading28" color={colors.textPrimary}>›</Day1Text>
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAY_HEADERS.map((label, index) => (
          <Day1Text
            key={index}
            variant="labelRegular14"
            color={colors.textSecondaryReadable}
            style={[styles.cell, styles.centerText]}
          >
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
            return (
              <Pressable
                key={dayIndex}
                onPress={() => onSelectDate(date)}
                style={[styles.cell, styles.dayCell, { backgroundColor: isSelected ? colors.actionPrimary : 'transparent' }]}
              >
                <Day1Text variant="labelRegular14" color={isSelected ? colors.textOnAction : colors.textPrimary}>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing[8] },
  monthLabel: { textTransform: 'capitalize' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cell: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing[8] },
  centerText: { textAlign: 'center' },
  dayCell: { borderRadius: Radius[12] },
});