import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/AuthProvider';

export function HomeScreen() {
  const colors = useTheme();
  const { signOut } = useSession();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundDefault }]}>
      <Day1Text variant="heading26">Sesión iniciada ✅</Day1Text>
      <Day1Button label="Cerrar sesión" variant="ghost" onPress={signOut} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing[16] },
});