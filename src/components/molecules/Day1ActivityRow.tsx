import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
import type { Activity, Category } from '@/features/activities/types';
import { Day1CategoryDot } from '../atoms/Day1CategoryDot';
import { Day1Text } from '../atoms/Day1Text';

type Day1ActivityRowProps = {
  activity: Activity;
  category: Category | undefined;
  onToggleComplete: () => void;
};

export function Day1ActivityRow({ activity, category, onToggleComplete }: Day1ActivityRowProps) {
  const colors = useTheme();
  const isCompleted = !!activity.completedAt;

  return (
    <Pressable
      onPress={onToggleComplete}
      style={[styles.row, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
      <Day1CategoryDot color={category?.color ?? colors.borderControl} />
      <View style={styles.texts}>
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
      </View>
    </Pressable>
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