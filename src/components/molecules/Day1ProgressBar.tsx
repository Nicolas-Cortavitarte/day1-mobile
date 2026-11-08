import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';
import { Radius } from '@/constants/theme';

type Props = {
  percent: number;
};

export function Day1ProgressBar({ percent }: Props) {
  const colors = useTheme();
  const reducedMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, percent));
  const animatedPercent = useRef(new Animated.Value(clamped)).current;

  useEffect(() => {
    if (reducedMotion) {
      animatedPercent.setValue(clamped);
      return;
    }
    Animated.timing(animatedPercent, {
      toValue: clamped,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [clamped, reducedMotion, animatedPercent]);

  const width = animatedPercent.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[styles.track, { backgroundColor: colors.progressTrack }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped) }}>
      <Animated.View style={[styles.fill, { width, backgroundColor: colors.actionPrimary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 10, borderRadius: Radius[8], overflow: 'hidden' },
  fill: { height: '100%', borderRadius: Radius[8] },
});
