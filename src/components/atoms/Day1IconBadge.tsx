import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius } from '@/constants/theme';
import { Day1Text } from '@/components/atoms/Day1Text';

type Day1IconBadgeProps = {
  glyph: string;
};

export function Day1IconBadge({ glyph }: Day1IconBadgeProps) {
  const colors = useTheme();

  return (
    <View style={[styles.badge, { backgroundColor: colors.surfaceBrandSoft }]}>
      <Day1Text variant="display32">{glyph}</Day1Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 100,
    height: 100,
    borderRadius: Radius[32],
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});