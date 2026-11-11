import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';
import { MinTouchTarget, Radius } from '@/constants/theme';
import { Day1Icon } from './Day1Icon';

type Day1CheckboxProps = {
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

const BOX_SIZE = 24;
const TOUCH_MARGIN = (MinTouchTarget - BOX_SIZE) / 2;

export function Day1Checkbox({ checked, onPress, disabled = false, accessibilityLabel }: Day1CheckboxProps) {
  const colors = useTheme();
  const reducedMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (reducedMotion) return;

    if (checked) {
      scale.setValue(0.84);
      Animated.spring(scale, {
        toValue: 1,
        speed: 32,
        bounciness: 10,
        useNativeDriver: true,
      }).start();
    } else {
      scale.setValue(0.92);
      Animated.spring(scale, {
        toValue: 1,
        speed: 45,
        bounciness: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [checked, reducedMotion, scale]);

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked, disabled }}
      style={styles.touch}>
      <Animated.View
        style={[
          styles.box,
          {
            transform: [{ scale }],
            backgroundColor: checked
              ? colors.actionPrimary
              : disabled
                ? colors.surfaceDisabled
                : 'transparent',
            borderColor: checked
              ? colors.actionPrimary
              : disabled
                ? colors.borderSubtle
                : colors.borderControl,
            opacity: disabled ? 0.5 : 1,
          },
        ]}>
        {checked ? <Day1Icon name="check" size={16} strokeWidth={3} color={colors.textOnAction} /> : null}
      </Animated.View>
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
