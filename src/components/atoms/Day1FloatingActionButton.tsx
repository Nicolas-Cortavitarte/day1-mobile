import { Animated, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { usePressScale } from '@/hooks/use-press-scale';
import { useTheme } from '@/hooks/use-theme';
import { Radius, ShadowColor } from '@/constants/theme';
import { Day1Icon } from './Day1Icon';

type Day1FloatingActionButtonProps = Omit<PressableProps, 'style'>;

export function Day1FloatingActionButton({ onPressIn, onPressOut, ...rest }: Day1FloatingActionButtonProps) {
  const colors = useTheme();
  const { scaleStyle, onPressIn: scaleIn, onPressOut: scaleOut } = usePressScale(0.93);

  return (
    <Animated.View style={[styles.wrapper, scaleStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Nueva actividad"
        onPressIn={(event) => {
          scaleIn();
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scaleOut();
          onPressOut?.(event);
        }}
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: pressed ? colors.actionPressed : colors.actionPrimary },
        ]}
        {...rest}>
        <Day1Icon name="plus" size={28} strokeWidth={2.5} color={colors.textOnAction} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: Radius[24],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ShadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});
