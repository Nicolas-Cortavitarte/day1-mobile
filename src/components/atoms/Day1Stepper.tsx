import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
import { Day1Icon } from './Day1Icon';
import { Day1Text } from './Day1Text';

type Day1StepperProps = {
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
};

export function Day1Stepper({ value, onChange, suffix, min = 1, max = 99, step = 1 }: Day1StepperProps) {
  const colors = useTheme();
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - step))}
        disabled={atMin}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Disminuir"
        accessibilityState={{ disabled: atMin }}
        style={[styles.button, { backgroundColor: colors.surfaceBrandSoft, opacity: atMin ? 0.5 : 1 }]}>
        <Day1Icon name="minus" size={18} color={colors.actionPressed} />
      </Pressable>

      <Day1Text variant="bodySemiBold16" accessibilityLiveRegion="polite">
        {value}
        {suffix ? ` ${suffix}` : ''}
      </Day1Text>

      <Pressable
        onPress={() => onChange(Math.min(max, value + step))}
        disabled={atMax}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Aumentar"
        accessibilityState={{ disabled: atMax }}
        style={[styles.button, { backgroundColor: colors.surfaceBrandSoft, opacity: atMax ? 0.5 : 1 }]}>
        <Day1Icon name="plus" size={18} color={colors.actionPressed} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing[12] },
  button: { width: 32, height: 32, borderRadius: Radius[16], alignItems: 'center', justifyContent: 'center' },
});
