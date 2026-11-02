import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { Spacing } from '@/constants/theme';
import { useProfile } from '@/features/profile/useProfile';
import { useTheme } from '@/hooks/use-theme';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const colors = useTheme();
  const { profile, isLoading, error, updateProfile } = useProfile();

  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? '');
      setAvatarUrl(profile.avatarUrl ?? '');
    }
  }, [profile]);

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await updateProfile({ displayName: displayName || undefined, avatarUrl: avatarUrl || undefined });
      navigation.goBack();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Day1Button label="Cancelar" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <Day1Text variant="heading26">Editar perfil</Day1Text>

        {error ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>{error}</Day1Text>
        ) : isLoading ? (
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>Cargando...</Day1Text>
        ) : (
          <>
            <Day1TextField label="Nombre" value={displayName} onChangeText={setDisplayName} placeholder="Tu nombre" />
            <Day1TextField
              label="URL de foto de perfil (opcional)"
              value={avatarUrl}
              onChangeText={setAvatarUrl}
              placeholder="https://..."
              autoCapitalize="none"
            />

            {saveError ? (
              <Day1Text variant="labelRegular14" color={colors.statusError}>{saveError}</Day1Text>
            ) : null}

            <Day1Button
              label={saving ? 'Guardando...' : 'Guardar'}
              variant="primary"
              onPress={handleSave}
              disabled={saving}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, padding: Spacing[16], gap: Spacing[16] },
  header: { flexDirection: 'row' },
});