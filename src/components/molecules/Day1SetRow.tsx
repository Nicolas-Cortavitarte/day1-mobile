import { StyleSheet, View } from 'react-native';

import { Day1Icon } from '@/components/atoms/Day1Icon';
import { Day1Text } from '@/components/atoms/Day1Text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { WorkoutSet } from '@/features/workouts/types';

type Props = {
  set: WorkoutSet;
};

export function Day1SetRow({ set }: Props) {
  const colors = useTheme();
  const done = !!set.completedAt;

  const parts: string[] = [];
  if (set.reps != null) parts.push(`${set.reps} reps`);
  if (set.weightValue != null) parts.push(`${set.weightValue} ${set.weightUnit ?? ''}`.trim());
  if (set.durationSeconds != null) parts.push(`${set.durationSeconds}s`);

  return (
    <View style={styles.row} accessibilityLabel={`Serie ${set.setNumber}, ${done ? 'completada' : 'pendiente'}`}>
      <Day1Text variant="labelMedium14" color={colors.textSecondaryReadable}>
        Serie {set.setNumber}
      </Day1Text>
      <Day1Text variant="bodyRegular16">{parts.join(' · ') || 'Sin datos'}</Day1Text>
      <Day1Icon
        name={done ? 'check' : 'minus'}
        size={18}
        strokeWidth={done ? 3 : 2}
        color={done ? colors.statusSuccess : colors.textSecondaryReadable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing[4] },
});
