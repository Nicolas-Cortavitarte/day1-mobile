import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { MinTouchTarget, Radius, Spacing } from '@/constants/theme';
import { Day1RadioRow } from '../molecules/Day1RadioRow';
import { Day1Icon } from './Day1Icon';
import { Day1Text } from './Day1Text';

const PRESETS: { label: string; minutes: number | null }[] = [
  { label: 'Sin recordatorio', minutes: null },
  { label: '10 minutos antes', minutes: 10 },
  { label: '30 minutos antes', minutes: 30 },
  { label: '1 hora antes', minutes: 60 },
  { label: '1 día antes', minutes: 1440 },
];

type Day1ReminderFieldProps = {
  label: string;
  value: number | null;
  onChange: (minutes: number | null) => void;
};

export function Day1ReminderField({ label, value, onChange }: Day1ReminderFieldProps) {
  const colors = useTheme();
  const [open, setOpen] = useState(false);
  const current = PRESETS.find((p) => p.minutes === value) ?? PRESETS[0];

  return (
    <View style={styles.field}>
      <Day1Text variant="labelMedium14">{label}</Day1Text>

      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${current.label}`}
        style={[styles.shell, { backgroundColor: colors.surfaceCard, borderColor: colors.borderControl }]}>
        <Day1Text variant="bodyRegular16" color={value === null ? colors.textSecondaryReadable : colors.textPrimary}>
          {current.label}
        </Day1Text>
        <Day1Icon name="bell" size={20} color={colors.textSecondaryReadable} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.surfaceScrim }]}
          onPress={() => setOpen(false)}
          accessibilityLabel="Cerrar">
          <View style={[styles.sheet, { backgroundColor: colors.surfaceCard }]}>
            {PRESETS.map((preset, index) => (
              <Day1RadioRow
                key={preset.label}
                label={preset.label}
                selected={preset.minutes === value}
                onPress={() => {
                  onChange(preset.minutes);
                  setOpen(false);
                }}
                isLast={index === PRESETS.length - 1}
              />
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MinTouchTarget + 8,
    paddingHorizontal: 14,
    paddingVertical: Spacing[12],
    borderRadius: Radius[12],
    borderWidth: 1,
  },
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: Radius[20], borderTopRightRadius: Radius[20], paddingVertical: Spacing[8] },
});
