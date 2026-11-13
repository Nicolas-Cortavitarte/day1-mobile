import type { ReactElement } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { ANIMATIONS } from '@/assets/animations';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
import type { Activity, Category } from '@/features/activities/types';
import { Day1Button } from '../atoms/Day1Button';
import { Day1Lottie } from '../atoms/Day1Lottie';
import { Day1Text } from '../atoms/Day1Text';
import { Day1ActivityRow } from '../molecules/Day1ActivityRow';
import { Day1SkeletonCardList } from '../molecules/Day1SkeletonGroup';

type Day1ActivityListProps = {
  activities: Activity[];
  categories: Category[];
  onToggleComplete: (activity: Activity) => void;
  onPressActivity: (activity: Activity) => void;
  refreshControl?: ReactElement;
  listHeaderComponent?: ReactElement;
  loading?: boolean;
  emptyActionLabel?: string;
  onEmptyActionPress?: () => void;
};

export function Day1ActivityList({
  activities,
  categories,
  onToggleComplete,
  onPressActivity,
  refreshControl,
  listHeaderComponent,
  loading = false,
  emptyActionLabel,
  onEmptyActionPress,
}: Day1ActivityListProps) {
  const colors = useTheme();

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id}
      contentContainerStyle={activities.length === 0 ? styles.emptyContainer : styles.list}
      refreshControl={refreshControl}
      ListHeaderComponent={listHeaderComponent}
      ListEmptyComponent={
        loading ? (
          <Day1SkeletonCardList count={3} />
        ) : (
          <View style={[styles.emptyCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
            <Day1Lottie source={ANIMATIONS.emptyCalm} size={96} />
            <Day1Text variant="section20" style={styles.centerText}>
              Día despejado
            </Day1Text>
            <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable} style={styles.centerText}>
              No tienes actividades programadas para esta fecha.
            </Day1Text>
            {emptyActionLabel && onEmptyActionPress ? (
              <Day1Button
                label={emptyActionLabel}
                icon="plus"
                variant="secondary"
                onPress={onEmptyActionPress}
                style={styles.emptyButton}
              />
            ) : null}
          </View>
        )
      }
      renderItem={({ item }) => (
        <Day1ActivityRow
          activity={item}
          category={categories.find((c) => c.id === item.categoryId)}
          onPress={() => onPressActivity(item)}
          onToggleComplete={() => onToggleComplete(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing[10], paddingHorizontal: Spacing[20], paddingTop: Spacing[8], paddingBottom: Spacing[64] },
  emptyContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing[20],
    paddingTop: Spacing[8],
    paddingBottom: Spacing[64],
    gap: Spacing[12],
  },
  emptyCard: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing[10],
    padding: Spacing[24],
    borderRadius: Radius[20],
    borderWidth: 1,
  },
  emptyButton: {
    width: '100%',
    marginTop: Spacing[4],
  },
  centerText: { textAlign: 'center' },
});
