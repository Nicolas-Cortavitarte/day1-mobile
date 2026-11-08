import { Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { MinTouchTarget, Radius, Spacing } from '@/constants/theme';
import { Day1Icon, type Day1IconName } from './Day1Icon';
import { Day1Text } from './Day1Text';

export type Day1ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';

type Day1ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: Day1ButtonVariant;
  icon?: Day1IconName;
  style?: ViewStyle;
  textColor?: string;
};

export function Day1Button({
  label,
  variant = 'primary',
  icon,
  disabled,
  style,
  textColor: textColorOverride,
  ...rest
}: Day1ButtonProps) {
  const colors = useTheme();

  const backgroundColor = (pressed: boolean) => {
    if (disabled) return colors.surfaceDisabled;
    if (variant === 'primary') return pressed ? colors.actionPressed : colors.actionPrimary;
    if (variant === 'secondary') return colors.surfaceBrandSoft;
    if (variant === 'destructive') return colors.statusError;
    return 'transparent';
  };

  const textColor = () => {
    if (disabled) return colors.textSecondaryReadable;
    if (textColorOverride) return textColorOverride;
    if (variant === 'primary' || variant === 'destructive') return colors.textOnAction;
    return colors.actionPressed;
  };

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: backgroundColor(pressed) },
        pressed && variant !== 'primary' && !disabled && styles.pressedFallback,
        style,
      ]}
      {...rest}>
      {icon ? <Day1Icon name={icon} size={18} color={textColor()} /> : null}
      <Day1Text variant="bodySemiBold16" color={textColor()}>
        {label}
      </Day1Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[8],
    minHeight: MinTouchTarget,
    paddingHorizontal: Spacing[16],
    paddingVertical: Spacing[12],
    borderRadius: Radius[14],
  },
  pressedFallback: { opacity: 0.7 },
});
