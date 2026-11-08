import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { MinTouchTarget, Radius } from '@/constants/theme';
import { Day1Icon } from './Day1Icon';

type Day1CheckboxProps = {
  checked: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
};

const BOX_SIZE = 24;
const TOUCH_MARGIN = (MinTouchTarget - BOX_SIZE) / 2;

export function Day1Checkbox({ checked, onPress, accessibilityLabel }: Day1CheckboxProps) {
  const colors = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked }}
      style={styles.touch}>
      <View
        style={[
          styles.box,
          {
            backgroundColor: checked ? colors.actionPrimary : 'transparent',
            borderColor: checked ? colors.actionPrimary : colors.borderControl,
          },
        ]}>
        {checked ? <Day1Icon name="check" size={16} strokeWidth={3} color={colors.textOnAction} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touch: {
    width: MinTouchTarget,
    height: MinTouchTarget,
    margin: -TOUCH_MARGIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: Radius[8],
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
