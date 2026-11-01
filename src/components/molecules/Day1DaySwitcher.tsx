import { Pressable, StyleSheet, View } from 'react-native';

import { Day1Text } from '@/components/atoms/Day1Text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { addDays, longDateLabel } from '@/features/activities/dateUtils';

type Props = {
  date: string;
  onChangeDate: (date: string) => void;
};

export function Day1DaySwitcher({ date, onChangeDate }: Props) {
  const colors = useTheme();

  return (
    <View style={styles.row}>
      <Pressable onPress={() => onChangeDate(addDays(date, -1))} hitSlop={12} style={styles.arrow}>
        <Day1Text variant="heading28" color={colors.textPrimary}>‹</Day1Text>
      </Pressable>

      <Day1Text variant="labelRegular14" color={colors.textPrimary} style={styles.label}>
        {longDateLabel(date)}
      </Day1Text>

      <Pressable onPress={() => onChangeDate(addDays(date, 1))} hitSlop={12} style={styles.arrow}>
        <Day1Text variant="heading28" color={colors.textPrimary}>›</Day1Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing[8] },
  arrow: { paddingHorizontal: Spacing[12] },
  label: { flex: 1, textAlign: 'center', textTransform: 'capitalize' },
});