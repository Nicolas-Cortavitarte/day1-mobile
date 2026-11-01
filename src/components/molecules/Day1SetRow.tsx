import { StyleSheet, View } from 'react-native';

import { Day1Text } from '@/components/atoms/Day1Text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { WorkoutSet } from '@/features/workouts/types';

type Props = {
  set: WorkoutSet;
};

export function Day1SetRow({ set }: Props) {
  const colors = useTheme();

  const parts: string[] = [];
  if (set.reps != null) parts.push(`${set.reps} reps`);
  if (set.weightValue != null) parts.push(`${set.weightValue} ${set.weightUnit ?? ''}`.trim());
  if (set.durationSeconds != null) parts.push(`${set.durationSeconds}s`);

  return (
    <View style={styles.row}>
      <Day1Text variant="labelMedium14" color={colors.textSecondaryReadable}>
        Serie {set.setNumber}
      </Day1Text>
      <Day1Text variant="bodyRegular16">{parts.join(' · ') || 'Sin datos'}</Day1Text>
      <Day1Text variant="labelMedium14" color={set.completedAt ? colors.statusSuccess : colors.textSecondaryReadable}>
        {set.completedAt ? '✅' : '—'}
      </Day1Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing[4] },
});