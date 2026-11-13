import { useEffect, useState } from 'react';
import { AppState, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/app/navigation-types';
import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1ReminderField } from '@/components/atoms/Day1ReminderField';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1InlineNotice } from '@/components/molecules/Day1InlineNotice';
import { Radius, Spacing } from '@/constants/theme';
import { usePreferencesContext } from '@/features/profile/PreferencesProvider';
import type { PreferencesUpdate } from '@/features/profile/types';
import { useTheme } from '@/hooks/use-theme';
import { getErrorMessage } from '@/lib/errors';
import {
  cancelAllReminders,
  ensureNotificationPermission,
  getNotificationPermissionStatus,
  openSystemNotificationSettings,
} from '@/lib/notifications';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

export function NotificationsScreen({ navigation }: Props) {
  const colors = useTheme();
  const { preferences, updatePreferences } = usePreferencesContext();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [osAllowed, setOsAllowed] = useState<boolean>(true);

  const notificationsEnabled = preferences?.notificationsEnabled ?? true;
  const defaultReminderMinutes =
    preferences?.defaultReminderMinutes !== undefined
      ? preferences.defaultReminderMinutes
      : 10;

  useEffect(() => {
    getNotificationPermissionStatus().then(setOsAllowed);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        getNotificationPermissionStatus().then(setOsAllowed);
      }
    });
    return () => {
      sub.remove();
    };
  }, []);

  async function applyChanges(changes: PreferencesUpdate) {
    if (saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updatePreferences(changes);
    } catch (err) {
      setSaveError(getErrorMessage(err, 'No se pudo guardar tu preferencia.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleNotifications(nextValue: boolean) {
    if (nextValue) {
      const granted = await ensureNotificationPermission();
      setOsAllowed(granted);
      await applyChanges({ notificationsEnabled: true });
      return;
    }
    await cancelAllReminders();
    await applyChanges({ notificationsEnabled: false });
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Day1Button label="Volver" icon="arrowLeft" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <View style={styles.titleBlock}>
          <Day1Text variant="heading26">Notificaciones</Day1Text>
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
            Configura los recordatorios locales para tus actividades programadas.
          </Day1Text>
        </View>

        {saveError ? <Day1InlineNotice message={saveError} /> : null}

        {notificationsEnabled && !osAllowed ? (
          <View
            style={[
              styles.permissionCard,
              { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
            ]}>
            <Day1Text variant="bodySemiBold16">Permiso desactivado en el sistema</Day1Text>
            <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
              Activa las notificaciones de Day1 en los ajustes de tu teléfono para recibir recordatorios.
            </Day1Text>
            <Day1Button
              label="Abrir ajustes del teléfono"
              icon="bell"
              variant="secondary"
              onPress={openSystemNotificationSettings}
            />
          </View>
        ) : null}

        <View
          style={[
            styles.card,
            { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
          ]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleTexts}>
              <Day1Text variant="bodySemiBold16">Recordatorios de actividades</Day1Text>
              <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                Te avisaremos antes de cada actividad con hora de inicio.
              </Day1Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              disabled={saving}
              trackColor={{ false: colors.borderControl, true: colors.actionPrimary }}
            />
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
          ]}>
          <Day1ReminderField
            label="Recordatorio predeterminado al crear"
            value={defaultReminderMinutes}
            onChange={(minutes) => applyChanges({ defaultReminderMinutes: minutes })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[20], gap: Spacing[20], paddingBottom: Spacing[40] },
  header: { flexDirection: 'row', alignItems: 'center' },
  titleBlock: { gap: Spacing[6] },
  card: {
    borderRadius: Radius[16],
    borderWidth: 1,
    padding: Spacing[16],
  },
  permissionCard: {
    borderRadius: Radius[16],
    borderWidth: 1,
    padding: Spacing[16],
    gap: Spacing[10],
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing[12],
  },
  toggleTexts: {
    flex: 1,
    gap: Spacing[4],
  },
});
