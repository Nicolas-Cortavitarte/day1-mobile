import { FlatList, StyleSheet, View} from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { Activity, Category } from '@/features/activities/types';
import { Day1Text } from '../atoms/Day1Text';
import { Day1ActivityRow } from '../molecules/Day1ActivityRow';
import { ReactElement } from 'react';

type Day1ActivityListProps = {
  activities: Activity[];
  categories: Category[];
  onToggleComplete: (activity: Activity) => void;
  refreshControl?: ReactElement;
};

export function Day1ActivityList({
  activities,
  categories,
  onToggleComplete,
  refreshControl,
}: Day1ActivityListProps) {
  const colors = useTheme();

  if (activities.length === 0) {
    return (
      <View style={styles.empty}>
        <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
          No tienes actividades para hoy.
        </Day1Text>
      </View>
    );
  }

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshControl={refreshControl}
      renderItem={({ item }) => (
        <Day1ActivityRow
          activity={item}
          category={categories.find((c) => c.id === item.categoryId)}
          onToggleComplete={() => onToggleComplete(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing[8], padding: Spacing[16] },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing[16] },
});