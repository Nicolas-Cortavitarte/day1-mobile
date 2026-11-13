import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Day1Logo } from '@/components/atoms/Day1Logo';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Radius, Spacing } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';

export function SplashScreen() {
  const colors = useTheme();
  const reduceMotion = useReducedMotion();
  const fadeAnim = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const progressAnim = useRef(new Animated.Value(reduceMotion ? 0.5 : 0.25)).current;

  useEffect(() => {
    if (reduceMotion) {
      fadeAnim.setValue(1);
      progressAnim.setValue(0.5);
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 0.65,
        duration: 1200,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  }, [fadeAnim, progressAnim, reduceMotion]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <View style={styles.container}>
        <View style={styles.topSpacer} />

        <Animated.View style={[styles.centerBlock, { opacity: fadeAnim }]}>
          <View style={styles.brandRow}>
            <Day1Logo size={52} />
            <Day1Text variant="display46" color={colors.actionPressed}>
              Day1
            </Day1Text>
          </View>
          <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
            One day or day one.
          </Day1Text>
        </Animated.View>

        <View style={styles.footerBlock}>
          <View style={[styles.progressTrack, { backgroundColor: colors.progressTrack }]}>
            <Animated.View
              style={[
                styles.progressFill,
                { backgroundColor: colors.actionPrimary, width: progressWidth },
              ]}
            />
          </View>
          <Day1Text variant="labelRegular12" color={colors.textSecondaryReadable}>
            Todo empieza con un día.
          </Day1Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[24],
    paddingVertical: Spacing[32],
  },
  topSpacer: {
    height: Spacing[40],
  },
  centerBlock: {
    alignItems: 'center',
    gap: Spacing[12],
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[10],
  },
  footerBlock: {
    alignItems: 'center',
    gap: Spacing[10],
    paddingBottom: Spacing[8],
  },
  progressTrack: {
    width: 48,
    height: 4,
    borderRadius: Radius[8],
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius[8],
  },
});
