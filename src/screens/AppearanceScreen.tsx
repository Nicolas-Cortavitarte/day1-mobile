import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Icon } from '@/components/atoms/Day1Icon';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1InlineNotice } from '@/components/molecules/Day1InlineNotice';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { usePreferencesContext } from '@/features/profile/PreferencesProvider';
import type { FontScale, PreferencesUpdate, ThemePreference } from '@/features/profile/types';
import { getErrorMessage } from '@/lib/errors';
import { useTheme } from '@/hooks/use-theme';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'Appearance'>;

const THEME_OPTIONS: { value: ThemePreference; title: string; subtitle: string }[] = [
  { value: 'LIGHT', title: 'Claro', subtitle: 'Luz y tonos cálidos.' },
  { value: 'DARK', title: 'Oscuro', subtitle: 'Tonos suaves en la oscuridad.' },
  { value: 'SYSTEM', title: 'Sistema', subtitle: 'Al ritmo de tu dispositivo.' },
];

const FONT_SCALE_OPTIONS: { value: FontScale; label: string }[] = [
  { value: 'SMALL', label: 'Pequeño' },
  { value: 'MEDIUM', label: 'Medio' },
  { value: 'LARGE', label: 'Grande' },
];

function ThemePreviewThumbnail({ mode }: { mode: ThemePreference }) {
  if (mode === 'SYSTEM') {
    return (
      <View style={styles.previewSplitContainer}>
        <View style={[styles.previewHalf, { backgroundColor: Colors.light.backgroundDefault }]}>
          <View style={[styles.previewMiniBar, { backgroundColor: Colors.light.textPrimary }]} />
          <View style={[styles.previewMiniCard, { backgroundColor: Colors.light.surfaceCard }]}>
            <View style={[styles.previewMiniLine, { backgroundColor: Colors.light.textPrimary }]} />
            <View style={[styles.previewMiniLineShort, { backgroundColor: Colors.light.borderSubtle }]} />
          </View>
          <View style={[styles.previewMiniCta, { backgroundColor: Colors.light.actionPrimary }]} />
        </View>
        <View style={[styles.previewHalf, { backgroundColor: Colors.dark.backgroundDefault }]}>
          <View style={[styles.previewMiniBar, { backgroundColor: Colors.dark.textPrimary }]} />
          <View style={[styles.previewMiniCard, { backgroundColor: Colors.dark.surfaceCard }]}>
            <View style={[styles.previewMiniLine, { backgroundColor: Colors.dark.textPrimary }]} />
            <View style={[styles.previewMiniLineShort, { backgroundColor: Colors.dark.borderSubtle }]} />
          </View>
          <View style={[styles.previewMiniCta, { backgroundColor: Colors.dark.actionPrimary }]} />
        </View>
      </View>
    );
  }

  const palette = mode === 'DARK' ? Colors.dark : Colors.light;

  return (
    <View style={[styles.previewContainer, { backgroundColor: palette.backgroundDefault }]}>
      <View style={[styles.previewHeaderBar, { backgroundColor: palette.textPrimary }]} />
      <View style={[styles.previewCardBox, { backgroundColor: palette.surfaceCard }]}>
        <View style={[styles.previewCardLine, { backgroundColor: palette.textPrimary }]} />
        <View style={[styles.previewCardLineShort, { backgroundColor: palette.borderSubtle }]} />
      </View>
      <View style={[styles.previewCtaBar, { backgroundColor: palette.actionPrimary }]} />
    </View>
  );
}

export function AppearanceScreen({ navigation }: Props) {
  const colors = useTheme();
  const { preferences, updatePreferences } = usePreferencesContext();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const currentTheme: ThemePreference = preferences?.theme ?? 'SYSTEM';
  const currentFontScale: FontScale = preferences?.fontScale ?? 'MEDIUM';

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
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Day1Button label="Volver" icon="arrowLeft" variant="ghost" onPress={() => navigation.goBack()} />
        </View>

        <View style={styles.titleBlock}>
          <Day1Text variant="heading26">Apariencia</Day1Text>
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
            Elige cómo quieres ver tu espacio.
          </Day1Text>
        </View>

        {saveError ? <Day1InlineNotice message={saveError} /> : null}

        <View style={styles.section}>
          <Day1Text variant="labelSemiBold14" color={colors.textSecondaryReadable}>
            Tema de la aplicación
          </Day1Text>

          <View style={styles.cardsColumn}>
            {THEME_OPTIONS.map((option) => {
              const selected = currentTheme === option.value;
              return (
                <Pressable
                  key={option.value}
                  disabled={saving}
                  onPress={() => handleChange({ theme: option.value })}
                  accessibilityRole="radio"
                  accessibilityLabel={`${option.title}. ${option.subtitle}`}
                  accessibilityState={{ selected, disabled: saving }}
                  style={[
                    styles.themeCard,
                    {
                      backgroundColor: selected ? colors.surfaceBrandSoft : colors.surfaceCard,
                      borderColor: selected ? colors.actionPrimary : colors.borderSubtle,
                      borderWidth: selected ? 1.5 : 1,
                    },
                  ]}>
                  <ThemePreviewThumbnail mode={option.value} />

                  <View style={styles.themeCardTexts}>
                    <Day1Text variant="bodySemiBold16">{option.title}</Day1Text>
                    <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
                      {option.subtitle}
                    </Day1Text>
                  </View>

                  <View
                    style={[
                      styles.radioOuter,
                      { borderColor: selected ? colors.actionPrimary : colors.borderControl },
                    ]}>
                    {selected ? (
                      <View style={[styles.radioInner, { backgroundColor: colors.actionPrimary }]} />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.helperRow}>
            <Day1Icon name="smartphone" size={18} color={colors.textSecondaryReadable} />
            <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable} style={styles.flex}>
              Sistema sigue la apariencia clara u oscura de tu dispositivo.
            </Day1Text>
          </View>
        </View>

        <View style={styles.section}>
          <Day1Text variant="labelSemiBold14" color={colors.textSecondaryReadable}>
            Tamaño de letra
          </Day1Text>
          <View style={[styles.fontCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}>
            <View style={styles.row}>
              {FONT_SCALE_OPTIONS.map((option) => (
                <Day1Button
                  key={option.value}
                  label={option.label}
                  variant={currentFontScale === option.value ? 'primary' : 'secondary'}
                  onPress={() => handleChange({ fontScale: option.value })}
                  disabled={saving}
                  style={styles.flex}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: Spacing[20], gap: Spacing[20], paddingBottom: Spacing[40] },
  header: { flexDirection: 'row' },
  titleBlock: { gap: Spacing[6] },
  section: { gap: Spacing[12] },
  cardsColumn: { gap: Spacing[12] },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[16],
    padding: Spacing[16],
    borderRadius: Radius[20],
  },
  themeCardTexts: { flex: 1, gap: Spacing[4] },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  previewContainer: {
    width: 68,
    height: 68,
    borderRadius: Radius[14],
    padding: 8,
    justifyContent: 'space-between',
  },
  previewHeaderBar: { width: 22, height: 4, borderRadius: 2, opacity: 0.85 },
  previewCardBox: { borderRadius: 6, padding: 6, gap: 4 },
  previewCardLine: { width: '90%', height: 3, borderRadius: 2, opacity: 0.7 },
  previewCardLineShort: { width: '45%', height: 3, borderRadius: 2 },
  previewCtaBar: { width: '100%', height: 9, borderRadius: 4 },
  previewSplitContainer: {
    width: 68,
    height: 68,
    borderRadius: Radius[14],
    flexDirection: 'row',
    overflow: 'hidden',
  },
  previewHalf: { flex: 1, padding: 6, justifyContent: 'space-between' },
  previewMiniBar: { width: 14, height: 3, borderRadius: 2, opacity: 0.85 },
  previewMiniCard: { borderRadius: 4, padding: 4, gap: 3 },
  previewMiniLine: { width: '85%', height: 2.5, borderRadius: 2, opacity: 0.7 },
  previewMiniLineShort: { width: '55%', height: 2.5, borderRadius: 2 },
  previewMiniCta: { width: '100%', height: 8, borderRadius: 3 },
  helperRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[10], paddingTop: Spacing[4] },
  fontCard: { padding: Spacing[14], borderRadius: Radius[16], borderWidth: 1 },
  row: { flexDirection: 'row', gap: Spacing[8] },
  flex: { flex: 1 },
});
