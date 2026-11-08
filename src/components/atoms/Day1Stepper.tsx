import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
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

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        style={[styles.button, { backgroundColor: colors.surfaceBrandSoft, opacity: value <= min ? 0.5 : 1 }]}>
        <Day1Text variant="bodySemiBold16" color={colors.actionPressed}>
          −
        </Day1Text>
      </Pressable>

      <Day1Text variant="bodySemiBold16">
        {value}
        {suffix ? ` ${suffix}` : ''}
      </Day1Text>

      <Pressable
        onPress={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
        style={[styles.button, { backgroundColor: colors.surfaceBrandSoft, opacity: value >= max ? 0.5 : 1 }]}>
        <Day1Text variant="bodySemiBold16" color={colors.actionPressed}>
          +
        </Day1Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing[12] },
  button: { width: 32, height: 32, borderRadius: Radius[16], alignItems: 'center', justifyContent: 'center' },
});