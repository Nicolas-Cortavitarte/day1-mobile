import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { Day1Text } from '../atoms/Day1Text';

type Day1RadioRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  isLast?: boolean;
};

export function Day1RadioRow({ label, selected, onPress, isLast }: Day1RadioRowProps) {
  const colors = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[styles.row, !isLast && { borderBottomColor: colors.borderSubtle, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <View style={[styles.circle, { borderColor: selected ? colors.actionPrimary : colors.borderControl }]}>
        {selected ? <View style={[styles.dot, { backgroundColor: colors.actionPrimary }]} /> : null}
      </View>
      <Day1Text variant="bodyRegular16">{label}</Day1Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[12],
    paddingVertical: Spacing[14],
    paddingHorizontal: Spacing[14],
  },
  circle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
