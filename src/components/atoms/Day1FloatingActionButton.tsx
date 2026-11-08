import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius, ShadowColor } from '@/constants/theme';
import { Day1Icon } from './Day1Icon';

type Day1FloatingActionButtonProps = Omit<PressableProps, 'style'>;

export function Day1FloatingActionButton({ ...rest }: Day1FloatingActionButtonProps) {
  const colors = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Nueva actividad"
      style={({ pressed }) => [
        styles.fab,
        { backgroundColor: pressed ? colors.actionPressed : colors.actionPrimary },
      ]}
      {...rest}>
      <Day1Icon name="plus" size={28} strokeWidth={2.5} color={colors.textOnAction} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
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
