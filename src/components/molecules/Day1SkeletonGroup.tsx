import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Day1Skeleton } from '../atoms/Day1Skeleton';

type Day1SkeletonCardListProps = {
  count?: number;
  variant?: 'activity' | 'simple';
};

export function Day1SkeletonCardList({
  count = 3,
  variant = 'activity',
}: Day1SkeletonCardListProps) {
  const colors = useTheme();

  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <Day1Skeleton
            width={variant === 'activity' ? 32 : 24}
            height={variant === 'activity' ? 32 : 24}
            borderRadius={999}
          />
          <View style={styles.lines}>
            <Day1Skeleton width={index % 2 === 0 ? '62%' : '52%'} height={14} borderRadius={Radius[8]} />
            <Day1Skeleton width={index % 2 === 0 ? '38%' : '46%'} height={11} borderRadius={Radius[8]} />
          </View>
          {variant === 'activity' ? (
            <Day1Skeleton width={22} height={22} borderRadius={999} />
          ) : null}
        </View>
      ))}
    </View>
  );
}

export function Day1SkeletonStatsGrid() {
  const colors = useTheme();

  return (
    <View style={styles.statsGrid}>
      {Array.from({ length: 4 }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.statCard,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <Day1Skeleton width="55%" height={12} borderRadius={Radius[8]} />
          <Day1Skeleton width="42%" height={24} borderRadius={Radius[8]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing[10],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[12],
    borderRadius: Radius[16],
    borderWidth: 1,
    paddingHorizontal: Spacing[16],
    paddingVertical: Spacing[14],
  },
  lines: {
    flex: 1,
    gap: Spacing[6],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[10],
  },
  statCard: {
    width: '48%',
    flexGrow: 1,
    borderRadius: Radius[16],
    borderWidth: 1,
    padding: Spacing[16],
    gap: Spacing[10],
  },
});
