import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';

type Day1InputShellProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function Day1InputShell({ children, style }: Day1InputShellProps) {
  const colors = useTheme();
  return (
    <View
      style={[
        styles.shell,
        { backgroundColor: colors.surfaceCard, borderColor: colors.borderControl },
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
    borderWidth: 1,
    width: '100%',
  },
});