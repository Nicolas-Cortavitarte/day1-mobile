import { StyleSheet, View } from 'react-native';

import { ANIMATIONS } from '@/assets/animations';
import { Day1Lottie } from '@/components/atoms/Day1Lottie';
import { Day1Text } from '@/components/atoms/Day1Text';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';

type Day1DailyProgressSummaryProps = {
  completed: number;
  total: number;
};

export function Day1DailyProgressSummary({ completed, total }: Day1DailyProgressSummaryProps) {
  const colors = useTheme();
  const segments = Math.max(total, 1);
  const percentPerSegment = 100 / segments;
  const allCompleted = total > 0 && completed === total;

  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceBrandSoft }]}>
      <View style={styles.header}>
        <View style={styles.texts}>
          <Day1Text variant="labelRegular14" color={colors.actionPressed}>
            {allCompleted ? '¡Día completado!' : 'Un paso a la vez'}
          </Day1Text>
          <Day1Text variant="section20" color={colors.actionPressed}>
            {completed} de {total} completadas
          </Day1Text>
        </View>
        {allCompleted ? <Day1Lottie source={ANIMATIONS.success} size={44} /> : null}
      </View>

      <View style={styles.track}>
        {Array.from({ length: segments }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.segment,
              {
                width: `${percentPerSegment}%`,
                backgroundColor: index < completed ? colors.actionPrimary : colors.progressTrack,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing[12], padding: Spacing[16], borderRadius: Radius[20] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing[12] },
  texts: { flex: 1 },
  track: { flexDirection: 'row', gap: 2, height: 7, borderRadius: Radius[8], overflow: 'hidden' },
  segment: { height: 7 },
});
