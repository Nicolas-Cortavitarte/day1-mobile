import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
import type { Category } from '@/features/activities/types';
import { Day1CategoryDot } from '../atoms/Day1CategoryDot';
import { Day1Text } from '../atoms/Day1Text';

type Day1CategoryPickerProps = {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelect: (categoryId: number) => void;
};

export function Day1CategoryPicker({ categories, selectedCategoryId, onSelect }: Day1CategoryPickerProps) {
  const colors = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {categories.map((category) => {
        const isSelected = category.id === selectedCategoryId;
        return (
          <Pressable
            key={category.id}
            onPress={() => onSelect(category.id)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.surfaceBrandSoft : colors.surfaceCard,
                borderColor: isSelected ? colors.actionPrimary : colors.borderSubtle,
              },
            ]}>
            <Day1CategoryDot color={category.color} />
            <Day1Text variant="labelMedium14">{category.name}</Day1Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: Spacing[8], paddingVertical: Spacing[4] },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[6],
    paddingHorizontal: Spacing[12],
    paddingVertical: Spacing[8],
    borderRadius: Radius[20],
    borderWidth: 1,
  },
});