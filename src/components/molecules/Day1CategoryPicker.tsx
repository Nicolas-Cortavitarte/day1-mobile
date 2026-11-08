import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
import type { Category } from '@/features/activities/types';
import { Day1Text } from '../atoms/Day1Text';

type Day1CategoryPickerProps = {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelect: (categoryId: number) => void;
};

export function Day1CategoryPicker({ categories, selectedCategoryId, onSelect }: Day1CategoryPickerProps) {
  const colors = useTheme();

  return (
    <View style={styles.row}>
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
            {isSelected ? (
              <Day1Text variant="labelSemiBold14" color={colors.actionPressed}>
                ✓
              </Day1Text>
            ) : null}
            <Day1Text
              variant="labelMedium14"
              color={isSelected ? colors.actionPressed : colors.textPrimary}>
              {category.name}
            </Day1Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[8], paddingVertical: Spacing[4] },
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