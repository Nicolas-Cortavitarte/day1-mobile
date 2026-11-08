import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { Spacing } from '@/constants/theme';
import { useProfile } from '@/features/profile/useProfile';
import { getErrorMessage } from '@/lib/errors';
import { useTheme } from '@/hooks/use-theme';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

const URL_REGEX = /^https?:\/\/\S+\.\S+$/i;

export function EditProfileScreen({ navigation }: Props) {
  const colors = useTheme();
  const { profile, isLoading, error, reload, updateProfile } = useProfile();

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
    if (saving) return;

    const trimmedName = displayName.trim();
    const trimmedUrl = avatarUrl.trim();

    if (trimmedUrl && !URL_REGEX.test(trimmedUrl)) {
      setSaveError('La URL de la foto debe empezar con http:// o https://');
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      await updateProfile({
        displayName: trimmedName || null,
        avatarUrl: trimmedUrl || null,
      });
      navigation.goBack();
    } catch (err) {
      setSaveError(getErrorMessage(err, 'No se pudo guardar.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Day1Button label="Cancelar" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <Day1Text variant="heading26">Editar perfil</Day1Text>

        {!profile && error ? (
          <View style={styles.block}>
            <Day1Text variant="labelRegular14" color={colors.statusError}>{error}</Day1Text>
            <Day1Button label="Reintentar" variant="secondary" onPress={reload} />
          </View>
        ) : !profile && isLoading ? (
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>Cargando...</Day1Text>
        ) : (
          <>
            <Day1TextField
              label="Nombre"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Tu nombre"
              maxLength={80}
            />
            <Day1TextField
              label="URL de foto de perfil (opcional)"
              value={avatarUrl}
              onChangeText={setAvatarUrl}
              placeholder="https://..."
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[16], gap: Spacing[16] },
  header: { flexDirection: 'row' },
  block: { gap: Spacing[8] },
});
