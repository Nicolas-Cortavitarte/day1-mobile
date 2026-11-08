import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { MinTouchTarget, Radius, Spacing } from '@/constants/theme';
import type { Category } from '@/features/activities/types';
import { Day1Icon } from '../atoms/Day1Icon';
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
            accessibilityRole="radio"
            accessibilityLabel={category.name}
            accessibilityState={{ selected: isSelected }}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.surfaceBrandSoft : colors.surfaceCard,
                borderColor: isSelected ? colors.actionPrimary : colors.borderSubtle,
              },
            ]}>
            {isSelected ? <Day1Icon name="check" size={14} strokeWidth={3} color={colors.actionPressed} /> : null}
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
    minHeight: MinTouchTarget,
    paddingHorizontal: Spacing[12],
    paddingVertical: Spacing[8],
    borderRadius: Radius[20],
    borderWidth: 1,
  },
});
