import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius } from '@/constants/theme';

type Day1CheckboxProps = {
  checked: boolean;
  onPress: () => void;
};

export function Day1Checkbox({ checked, onPress }: Day1CheckboxProps) {
  const colors = useTheme();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={[
        styles.box,
        {
          backgroundColor: checked ? colors.actionPrimary : 'transparent',
          borderColor: checked ? colors.actionPrimary : colors.borderControl,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  box: { width: 22, height: 22, borderRadius: Radius[8], borderWidth: 2 },
});