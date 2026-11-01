import { Pressable, StyleSheet, View } from 'react-native';

import { Day1Text } from '@/components/atoms/Day1Text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing, Radius } from '@/constants/theme';
import { dayNumber, getWeekDates, monthYearLabel, nextWeekAnchor, prevWeekAnchor, weekdayLabel } from '@/features/activities/dateUtils';

type Props = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export function Day1WeekStrip({ selectedDate, onSelectDate }: Props) {
  const colors = useTheme();
  const weekDates = getWeekDates(selectedDate);

  return (
    <View>
      <Day1Text variant="labelRegular14" color={colors.textPrimary} style={styles.monthLabel}>
        {monthYearLabel(weekDates[0])}
      </Day1Text>

      <View style={styles.row}>
        <Pressable onPress={() => onSelectDate(prevWeekAnchor(selectedDate))} hitSlop={12} style={styles.arrow}>
          <Day1Text variant="heading28" color={colors.textPrimary}>‹</Day1Text>
        </Pressable>

        <View style={styles.days}>
          {weekDates.map((date) => {
            const isSelected = date === selectedDate;
            return (
              <Pressable
                key={date}
                onPress={() => onSelectDate(date)}
                style={[styles.dayCell, { backgroundColor: isSelected ? colors.actionPrimary : 'transparent' }]}
              >
                <Day1Text
                  variant="labelRegular14"
                  color={isSelected ? colors.textOnAction : colors.textSecondaryReadable}
                >
                  {weekdayLabel(date)}
                </Day1Text>
                <Day1Text
                  variant="labelRegular14"
                  color={isSelected ? colors.textOnAction : colors.textPrimary}
                >
                  {dayNumber(date)}
                </Day1Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={() => onSelectDate(nextWeekAnchor(selectedDate))} hitSlop={12} style={styles.arrow}>
          <Day1Text variant="heading28" color={colors.textPrimary}>›</Day1Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  monthLabel: { textAlign: 'center', textTransform: 'capitalize', paddingTop: Spacing[4] },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing[8] },
  arrow: { paddingHorizontal: Spacing[4] },
  days: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  dayCell: {
    alignItems: 'center',
    paddingVertical: Spacing[8],
    paddingHorizontal: Spacing[4],
    borderRadius: Radius[12],
    minWidth: 36,
  },
});