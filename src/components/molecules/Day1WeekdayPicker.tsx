import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
import { Day1Text } from '../atoms/Day1Text';

const DAYS: { value: number; label: string }[] = [
  { value: 1, label: 'L' },
  { value: 2, label: 'M' },
  { value: 3, label: 'M' },
  { value: 4, label: 'J' },
  { value: 5, label: 'V' },
  { value: 6, label: 'S' },
  { value: 0, label: 'D' },
];

type Day1WeekdayPickerProps = {
  selectedDays: number[];
  onToggleDay: (day: number) => void;
};

export function Day1WeekdayPicker({ selectedDays, onToggleDay }: Day1WeekdayPickerProps) {
  const colors = useTheme();

  return (
    <View style={styles.row}>
      {DAYS.map((day) => {
        const isSelected = selectedDays.includes(day.value);
        return (
          <Pressable
            key={day.value}
            onPress={() => onToggleDay(day.value)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.actionPrimary : colors.surfaceCard,
                borderColor: isSelected ? colors.actionPrimary : colors.borderSubtle,
              },
            ]}>
            <Day1Text variant="labelSemiBold14" color={isSelected ? colors.textOnAction : colors.textPrimary}>
              {day.label}
            </Day1Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing[6] },
  chip: {
    width: 36,
    height: 36,
    borderRadius: Radius[18],
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});