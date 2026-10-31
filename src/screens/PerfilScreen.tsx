import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/AuthProvider';
import { useTheme } from '@/hooks/use-theme';

export function PerfilScreen() {
  const colors = useTheme();
  const { signOut } = useSession();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundDefault }]}>
      <View style={styles.content}>
        <Day1Text variant="heading26">Perfil</Day1Text>
        <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
          Edición de perfil próximamente (Fase 7).
        </Day1Text>
        <Day1Button label="Cerrar sesión" variant="ghost" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing[12] },
});