import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Day1Avatar } from '@/components/atoms/Day1Avatar';
import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Icon, type Day1IconName } from '@/components/atoms/Day1Icon';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1ConfirmDeleteModal } from '@/components/molecules/Day1ConfirmDeleteModal';
import { Day1InlineNotice } from '@/components/molecules/Day1InlineNotice';
import { Radius, Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/AuthProvider';
import { useProfile } from '@/features/profile/useProfile';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { useTheme } from '@/hooks/use-theme';
import type { MainTabScreenProps } from '@/app/navigation-types';

type Props = MainTabScreenProps<'Perfil'>;

type MenuItem = {
  label: string;
  icon: Day1IconName;
  onPress: () => void;
};

export function PerfilScreen({ navigation }: Props) {
  const colors = useTheme();
  const { signOut } = useSession();
  const { profile } = useProfile();
  const [deleting, setDeleting] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function deleteAccount() {
    if (deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await api.delete('/me');
    } catch (err) {
      setDeleting(false);
      setConfirmVisible(false);
      setDeleteError(getErrorMessage(err, 'No se pudo eliminar la cuenta. Inténtalo de nuevo.'));
      return;
    }

    setConfirmVisible(false);
    await signOut().catch(() => {});
  }

  const menuItems: MenuItem[] = [
    { label: 'Editar perfil', icon: 'user', onPress: () => navigation.navigate('EditProfile') },
    { label: 'Mis categorías', icon: 'tag', onPress: () => navigation.navigate('ManageCategories') },
    { label: 'Mis ejercicios', icon: 'dumbbell', onPress: () => navigation.navigate('ManageExercises') },
    { label: 'Apariencia', icon: 'palette', onPress: () => navigation.navigate('Appearance') },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Day1Text variant="heading26">Perfil</Day1Text>

        <View style={[styles.profileCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
          <Day1Avatar
            uri={profile?.avatarUrl}
            name={profile?.displayName}
            email={profile?.email}
            size={56}
          />
          <View style={styles.profileTexts}>
            <Day1Text variant="section20">{profile?.displayName || 'Mi espacio'}</Day1Text>
            {profile?.email ? (
              <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                {profile.email}
              </Day1Text>
            ) : null}
          </View>
        </View>

        {deleteError ? <Day1InlineNotice message={deleteError} /> : null}

        <View style={[styles.menuCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.label}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={item.onPress}
              style={[
                styles.menuRow,
                index < menuItems.length - 1 && {
                  borderBottomColor: colors.borderSubtle,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              ]}>
              <View style={styles.menuRowLeft}>
                <Day1Icon name={item.icon} size={20} color={colors.actionPrimary} />
                <Day1Text variant="bodyRegular16">{item.label}</Day1Text>
              </View>
              <Day1Icon name="chevronRight" size={18} color={colors.textSecondaryReadable} />
            </Pressable>
          ))}
        </View>

        <View style={styles.sessionSection}>
          <Day1Button
            label="Cerrar sesión"
            icon="logOut"
            variant="secondary"
            onPress={signOut}
            disabled={deleting}
          />
          <Day1Button
            label="Eliminar cuenta"
            icon="trash"
            variant="ghost"
            textColor={colors.statusError}
            onPress={() => setConfirmVisible(true)}
            disabled={deleting}
          />
        </View>
      </ScrollView>

      <Day1ConfirmDeleteModal
        visible={confirmVisible}
        title="¿Eliminar tu cuenta?"
        message="Se borrarán todas tus actividades, ejercicios y categorías. Esta acción no se puede deshacer."
        confirmLabel="Eliminar cuenta"
        loading={deleting}
        onConfirm={deleteAccount}
        onCancel={() => setConfirmVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing[20], gap: Spacing[20], paddingBottom: Spacing[40] },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[14],
    padding: Spacing[16],
    borderRadius: Radius[16],
    borderWidth: 1,
  },
  profileTexts: { flex: 1, gap: 2 },
  menuCard: { borderRadius: Radius[16], borderWidth: 1, overflow: 'hidden' },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[16],
    paddingVertical: Spacing[14],
  },
  menuRowLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing[12] },
  sessionSection: { gap: Spacing[8], marginTop: Spacing[8] },
});
