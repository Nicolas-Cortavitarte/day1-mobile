import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Radius } from '@/constants/theme';
import { Day1Text } from './Day1Text';

type Day1FloatingActionButtonProps = Omit<PressableProps, 'style'>;

export function Day1FloatingActionButton({ ...rest }: Day1FloatingActionButtonProps) {
  const colors = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.fab,
        { backgroundColor: pressed ? colors.actionPressed : colors.actionPrimary },
      ]}
      {...rest}>
      <Day1Text variant="heading28" color={colors.textOnAction} style={styles.plus}>
        +
      </Day1Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  plus: { marginTop: -2 },
});