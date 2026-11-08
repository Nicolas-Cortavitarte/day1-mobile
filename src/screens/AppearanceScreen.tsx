import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Spacing } from '@/constants/theme';
import { usePreferencesContext } from '@/features/profile/PreferencesProvider';
import type { FontScale, PreferencesUpdate, ThemePreference } from '@/features/profile/types';
import { getErrorMessage } from '@/lib/errors';
import { useTheme } from '@/hooks/use-theme';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'Appearance'>;

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'SYSTEM', label: 'Automático' },
  { value: 'LIGHT', label: 'Claro' },
  { value: 'DARK', label: 'Oscuro' },
];

const FONT_SCALE_OPTIONS: { value: FontScale; label: string }[] = [
  { value: 'SMALL', label: 'Pequeño' },
  { value: 'MEDIUM', label: 'Medio' },
  { value: 'LARGE', label: 'Grande' },
];

export function AppearanceScreen({ navigation }: Props) {
  const colors = useTheme();
  const { preferences, updatePreferences } = usePreferencesContext();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleChange(changes: PreferencesUpdate) {
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Day1Button label="Volver" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <Day1Text variant="heading26">Apariencia</Day1Text>

        <Day1Text variant="bodySemiBold16">Tema</Day1Text>
        <View style={styles.row}>
          {THEME_OPTIONS.map((option) => (
            <Day1Button
              key={option.value}
              label={option.label}
              variant={preferences?.theme === option.value ? 'primary' : 'secondary'}
              onPress={() => handleChange({ theme: option.value })}
              disabled={saving}
            />
          ))}
        </View>

        <Day1Text variant="bodySemiBold16" style={styles.sectionSpacing}>Tamaño de letra</Day1Text>
        <View style={styles.row}>
          {FONT_SCALE_OPTIONS.map((option) => (
            <Day1Button
              key={option.value}
              label={option.label}
              variant={preferences?.fontScale === option.value ? 'primary' : 'secondary'}
              onPress={() => handleChange({ fontScale: option.value })}
              disabled={saving}
            />
          ))}
        </View>

        {saveError ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>{saveError}</Day1Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, padding: Spacing[16], gap: Spacing[8] },
  header: { flexDirection: 'row' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[8] },
  sectionSpacing: { marginTop: Spacing[16] },
});
