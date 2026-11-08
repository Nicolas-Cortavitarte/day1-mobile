import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius } from '@/constants/theme';
import { Day1Icon, type Day1IconName } from './Day1Icon';

type Day1IconBadgeProps = {
  icon: Day1IconName;
};

export function Day1IconBadge({ icon }: Day1IconBadgeProps) {
  const colors = useTheme();

  return (
    <View style={[styles.badge, { backgroundColor: colors.surfaceBrandSoft }]}>
      <Day1Icon name={icon} size={44} strokeWidth={1.75} color={colors.actionPrimary} />
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
