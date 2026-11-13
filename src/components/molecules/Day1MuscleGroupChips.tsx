import { Pressable, StyleSheet, View } from 'react-native';

import { MUSCLE_GROUP_PRESETS } from '@/components/atoms/Day1ExerciseThumbnail';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
};

export function Day1MuscleGroupChips({ value, onChange, compact = false }: Props) {
  const colors = useTheme();
  const normalized = value.toLowerCase();

  return (
    <View style={styles.chipsRow}>
      {MUSCLE_GROUP_PRESETS.map((preset) => {
        const selected = normalized === preset.label.toLowerCase();
        return (
          <Pressable
            key={preset.key}
            onPress={() => onChange(preset.label)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[
              styles.chip,
              compact && styles.chipCompact,
              {
                backgroundColor: selected
                  ? colors.actionPrimary
                  : colors.surfaceSegmented,
              },
            ]}>
            <Day1Text
              variant={
                compact
                  ? selected
                    ? 'labelSemiBold12'
                    : 'labelRegular12'
                  : selected
                    ? 'labelSemiBold14'
                    : 'labelRegular14'
              }
              color={selected ? colors.textOnAction : colors.textPrimary}>
              {preset.label}
            </Day1Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[8] },
  chip: {
    paddingHorizontal: Spacing[12],
    paddingVertical: Spacing[8],
    borderRadius: Radius[16],
  },
  chipCompact: {
    paddingHorizontal: Spacing[10],
    paddingVertical: Spacing[6],
  },
});
