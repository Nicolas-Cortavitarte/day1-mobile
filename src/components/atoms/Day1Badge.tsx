import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
import { Day1Text } from './Day1Text';

export type Day1BadgeTone = 'brand' | 'warning' | 'error' | 'success';

type Day1BadgeProps = {
  label: string;
  tone?: Day1BadgeTone;
};

export function Day1Badge({ label, tone = 'brand' }: Day1BadgeProps) {
  const colors = useTheme();

  const toneStyles: Record<Day1BadgeTone, { bg: string; text: string }> = {
    brand: { bg: colors.surfaceBrandSoft, text: colors.actionPressed },
    warning: { bg: colors.surfaceWarning, text: colors.statusWarning },
    error: { bg: colors.surfaceErrorSoft, text: colors.statusError },
    success: { bg: colors.surfaceBrandSoft, text: colors.statusSuccess },
  };
  const { bg, text } = toneStyles[tone];

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Day1Text variant="labelSemiBold12" color={text}>
        {label}
      </Day1Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing[10],
    paddingVertical: Spacing[6],
    borderRadius: Radius[20],
  },
});