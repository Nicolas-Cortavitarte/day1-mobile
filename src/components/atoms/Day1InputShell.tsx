import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';

type Day1InputShellProps = {
  children: React.ReactNode;
  focused?: boolean;
  style?: ViewStyle;
};

export function Day1InputShell({ children, focused, style }: Day1InputShellProps) {
  const colors = useTheme();
  return (
    <View
      style={[
        styles.shell,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: focused ? colors.actionPrimary : colors.borderControl,
          borderWidth: 1.5,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[8],
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: Spacing[12],
    borderRadius: Radius[12],
    width: '100%',
  },
});
