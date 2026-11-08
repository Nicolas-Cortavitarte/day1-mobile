import { StyleSheet, View } from 'react-native';

import { ANIMATIONS } from '@/assets/animations';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Day1Button } from '../atoms/Day1Button';
import { Day1Lottie } from '../atoms/Day1Lottie';
import { Day1Text } from '../atoms/Day1Text';

type Day1ErrorStateProps = {
  message: string;
  onRetry: () => void;
  compact?: boolean;
};

export function Day1ErrorState({ message, onRetry, compact = false }: Day1ErrorStateProps) {
  const colors = useTheme();

  return (
    <View style={[styles.container, compact ? styles.compact : styles.full]}>
      <Day1Lottie source={ANIMATIONS.alert} size={compact ? 52 : 72} />
      <Day1Text variant="labelRegular14" color={colors.statusError} style={styles.text}>
        {message}
      </Day1Text>
      <Day1Button label="Reintentar" variant="secondary" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', gap: Spacing[10] },
  full: { flex: 1, padding: Spacing[24] },
  compact: { paddingVertical: Spacing[12] },
  text: { textAlign: 'center' },
});
