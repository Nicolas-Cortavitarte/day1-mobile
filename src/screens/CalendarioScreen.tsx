import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Day1Text } from '@/components/atoms/Day1Text';
import { useTheme } from '@/hooks/use-theme';

export function CalendarioScreen() {
  const colors = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundDefault }]}>
      <View style={styles.content}>
        <Day1Text variant="heading26">Calendario</Day1Text>
        <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
          Próximamente (Fase 4).
        </Day1Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
});