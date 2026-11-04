import { Pressable, StyleSheet, View } from 'react-native';

import { Day1Text } from '@/components/atoms/Day1Text';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
import { dayNumber, getWeekDates, weekdayLabel } from '@/features/activities/dateUtils';

type Day1DateStripProps = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export function Day1DateStrip({ selectedDate, onSelectDate }: Day1DateStripProps) {
  const colors = useTheme();
  const weekDates = getWeekDates(selectedDate);

  return (
    <View style={styles.row}>
      {weekDates.map((date) => {
        const isSelected = date === selectedDate;
        return (
          <Pressable
            key={date}
            onPress={() => onSelectDate(date)}
            style={[styles.cell, { backgroundColor: isSelected ? colors.actionPrimary : 'transparent' }]}>
            <Day1Text variant="labelRegular12" color={isSelected ? colors.textOnAction : colors.textSecondaryReadable}>
              {weekdayLabel(date)}
            </Day1Text>
            <Day1Text variant="bodySemiBold17" color={isSelected ? colors.textOnAction : colors.textPrimary}>
              {dayNumber(date)}
            </Day1Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing[4], width: '100%' },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[6],
    height: 64,
    borderRadius: Radius[16],
  },
});