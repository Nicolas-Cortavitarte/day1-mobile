import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

import { usePressScale } from '@/hooks/use-press-scale';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
import type { Activity, Category } from '@/features/activities/types';
import { Day1CategoryDot } from '../atoms/Day1CategoryDot';
import { Day1Checkbox } from '../atoms/Day1Checkbox';
import { Day1Icon } from '../atoms/Day1Icon';
import { Day1Text } from '../atoms/Day1Text';

type Day1ActivityRowProps = {
  activity: Activity;
  category: Category | undefined;
  onPress: () => void;
  onToggleComplete: () => void;
};

export function Day1ActivityRow({ activity, category, onPress, onToggleComplete }: Day1ActivityRowProps) {
  const colors = useTheme();
  const reducedMotion = useReducedMotion();
  const isCompleted = !!activity.completedAt;
  const { scaleStyle, onPressIn, onPressOut } = usePressScale(0.985);
  const contentOpacity = useRef(new Animated.Value(isCompleted ? 0.65 : 1)).current;

  useEffect(() => {
    const target = isCompleted ? 0.65 : 1;
    if (reducedMotion) {
      contentOpacity.setValue(target);
      return;
    }
    Animated.timing(contentOpacity, {
      toValue: target,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [isCompleted, reducedMotion, contentOpacity]);

  return (
    <Animated.View style={scaleStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={activity.title}
        style={[styles.row, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
        <Day1Checkbox
          checked={isCompleted}
          onPress={onToggleComplete}
          accessibilityLabel={
            isCompleted ? `Marcar ${activity.title} como pendiente` : `Completar ${activity.title}`
          }
        />
        <Day1CategoryDot color={category?.color ?? colors.borderControl} />
        <Animated.View style={[styles.texts, { opacity: contentOpacity }]}>
          <Day1Text
            variant="bodySemiBold16"
            color={isCompleted ? colors.textSecondaryReadable : colors.textPrimary}
            style={isCompleted ? styles.strikethrough : undefined}>
            {activity.title}
          </Day1Text>
          {activity.startTime ? (
            <Day1Text variant="labelRegular13" color={colors.textSecondaryReadable}>
              {activity.startTime.slice(0, 5)}
            </Day1Text>
          ) : null}
        </Animated.View>
        <Day1Icon name="chevronRight" size={18} color={colors.textSecondaryReadable} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[12],
    padding: Spacing[12],
    borderRadius: Radius[14],
    borderWidth: 1,
  },
  texts: { flex: 1, gap: 2 },
  strikethrough: { textDecorationLine: 'line-through' },
});
