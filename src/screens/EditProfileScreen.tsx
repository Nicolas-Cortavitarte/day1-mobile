import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Avatar } from '@/components/atoms/Day1Avatar';
import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1KeyboardScrollView } from '@/components/atoms/Day1KeyboardScrollView';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/AuthProvider';
import { removeUserAvatarFile, uploadUserAvatar } from '@/features/profile/avatarStorage';
import { useProfile } from '@/features/profile/useProfile';
import { getErrorMessage } from '@/lib/errors';
import { useTheme } from '@/hooks/use-theme';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

type PendingAvatar = {
  uri: string;
  base64: string;
  mimeType?: string;
};

export function EditProfileScreen({ navigation }: Props) {
  const colors = useTheme();
  const { session } = useSession();
  const { profile, isLoading, error, reload, updateProfile } = useProfile();

  const [displayName, setDisplayName] = useState('');
  const [pendingAvatar, setPendingAvatar] = useState<PendingAvatar | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? '');
    }
  }, [profile]);

  const previewUri = avatarRemoved ? null : (pendingAvatar?.uri ?? profile?.avatarUrl ?? null);

  async function handlePickPhoto() {
    if (saving) return;
    setSaveError(null);

    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.8,
      includeBase64: true,
    });

    if (result.didCancel) return;

    if (result.errorCode) {
      setSaveError(result.errorMessage || 'No se pudo abrir la galería de fotos.');
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri || !asset.base64) {
      setSaveError('No se pudo leer la imagen seleccionada.');
      return;
    }

    setPendingAvatar({
      uri: asset.uri,
      base64: asset.base64,
      mimeType: asset.type,
    });
    setAvatarRemoved(false);
  }

  function handleRemovePhoto() {
    if (saving) return;
    setPendingAvatar(null);
    setAvatarRemoved(true);
    setSaveError(null);
  }

  async function handleSave() {
    if (saving) return;

    const trimmedName = displayName.trim();
    const userId = session?.user.id ?? profile?.id;

    setSaving(true);
    setSaveError(null);
    try {
      let nextAvatarUrl: string | null = profile?.avatarUrl ?? null;

      if (avatarRemoved) {
        if (profile?.avatarUrl) {
          removeUserAvatarFile(profile.avatarUrl).catch(() => {});
        }
        nextAvatarUrl = null;
      } else if (pendingAvatar) {
        if (!userId) {
          throw new Error('No se encontró la sesión del usuario.');
        }
        nextAvatarUrl = await uploadUserAvatar({
          userId,
          base64: pendingAvatar.base64,
          mimeType: pendingAvatar.mimeType,
          previousUrl: profile?.avatarUrl,
        });
      }

      await updateProfile({
        displayName: trimmedName || null,
        avatarUrl: nextAvatarUrl,
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
      <Day1KeyboardScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Day1Button label="Cancelar" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <Day1Text variant="heading26">Editar perfil</Day1Text>

        {!profile && error ? (
          <View style={styles.block}>
            <Day1Text variant="labelRegular14" color={colors.statusError}>
              {error}
            </Day1Text>
            <Day1Button label="Reintentar" variant="secondary" onPress={reload} />
          </View>
        ) : !profile && isLoading ? (
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
            Cargando...
          </Day1Text>
        ) : (
          <>
            <View style={styles.avatarSection}>
              <Day1Avatar
                uri={previewUri}
                name={displayName || profile?.displayName}
                email={profile?.email}
                size={88}
              />
              <View style={styles.avatarActions}>
                <Day1Button
                  label={previewUri ? 'Cambiar foto' : 'Elegir foto'}
                  variant="secondary"
                  onPress={handlePickPhoto}
                  disabled={saving}
                />
                {previewUri ? (
                  <Day1Button
                    label="Quitar foto"
                    variant="ghost"
                    textColor={colors.statusError}
                    onPress={handleRemovePhoto}
                    disabled={saving}
                  />
                ) : null}
              </View>
            </View>

            <Day1TextField
              label="Nombre"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Tu nombre"
              maxLength={80}
            />

            {saveError ? (
              <Day1Text variant="labelRegular14" color={colors.statusError}>
                {saveError}
              </Day1Text>
            ) : null}

            <Day1Button
              label={saving ? 'Guardando...' : 'Guardar'}
              variant="primary"
              onPress={handleSave}
              disabled={saving}
            />
          </>
        )}
      </Day1KeyboardScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[16], gap: Spacing[16] },
  header: { flexDirection: 'row' },
  block: { gap: Spacing[8] },
  avatarSection: { alignItems: 'center', gap: Spacing[12], paddingVertical: Spacing[8] },
  avatarActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing[8] },
});
