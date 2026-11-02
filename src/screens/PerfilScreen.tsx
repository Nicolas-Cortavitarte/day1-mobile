import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/AuthProvider';
import { useProfile } from '@/features/profile/useProfile';
import { api } from '@/lib/api';
import { useTheme } from '@/hooks/use-theme';
import type { MainTabScreenProps } from '@/app/navigation-types';

type Props = MainTabScreenProps<'Perfil'>;

export function PerfilScreen({ navigation }: Props) {
  const colors = useTheme();
  const { signOut } = useSession();
  const { profile } = useProfile();

  function confirmDeleteAccount() {
    Alert.alert(
      'Eliminar cuenta',
      'Se borrarán todas tus actividades, ejercicios y categorías. Esta acción no se puede deshacer. ¿Seguro que quieres continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar cuenta',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete('/me');
              await signOut();
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo eliminar la cuenta.');
            }
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundDefault }]}>
      <View style={styles.content}>
        <Day1Text variant="heading26">{profile?.displayName || 'Mi espacio'}</Day1Text>
        {profile?.email ? (
          <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>{profile.email}</Day1Text>
        ) : null}

        <View style={styles.menu}>
          <Day1Button label="Editar perfil" variant="secondary" onPress={() => navigation.navigate('EditProfile')} />
          <Day1Button label="Mis categorías" variant="secondary" onPress={() => navigation.navigate('ManageCategories')} />
          <Day1Button label="Apariencia" variant="secondary" onPress={() => navigation.navigate('Appearance')} />
          <Day1Button label="Cerrar sesión" variant="ghost" onPress={signOut} />
          <Day1Button label="Eliminar cuenta" variant="destructive" onPress={confirmDeleteAccount} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: Spacing[16], gap: Spacing[12] },
  menu: { gap: Spacing[8], marginTop: Spacing[16] },
});