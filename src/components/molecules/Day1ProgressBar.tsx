import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius } from '@/constants/theme';

type Props = {
  percent: number;
};

export function Day1ProgressBar({ percent }: Props) {
  const colors = useTheme();
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <View style={[styles.track, { backgroundColor: colors.progressTrack }]}>
      <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: colors.actionPrimary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 10, borderRadius: Radius[8], overflow: 'hidden' },
  fill: { height: '100%', borderRadius: Radius[8] },
});