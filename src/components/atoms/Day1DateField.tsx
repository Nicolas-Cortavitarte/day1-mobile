import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';
import { Day1Text } from './Day1Text';
import { Day1Button } from './Day1Button';

type Day1DateFieldProps = {
  label: string;
  mode: 'date' | 'time';
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  minimumDate?: Date;
  errorBorder?: boolean;
  style?: object;
};

function formatValue(value: Date | null, mode: 'date' | 'time') {
  if (!value) return null;
  if (mode === 'time') {
    return value.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  const formatted = value.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
  return formatted.replace('.', '');
}

export function Day1DateField({
  label,
  mode,
  value,
  onChange,
  placeholder,
  minimumDate,
  errorBorder,
  style,
}: Day1DateFieldProps) {
  const colors = useTheme();
  const [iosPickerOpen, setIosPickerOpen] = useState(false);
  const [draftValue, setDraftValue] = useState(value ?? new Date());

  function openPicker() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: value ?? new Date(),
        mode,
        minimumDate,
        onChange: (event, selected) => {
          if (event.type === 'set' && selected) onChange(selected);
        },
      });
      return;
    }
    setDraftValue(value ?? new Date());
    setIosPickerOpen(true);
  }

  const display = formatValue(value, mode);

  return (
    <View style={[styles.field, style]}>
      <Day1Text variant="labelMedium14">{label}</Day1Text>

      <Pressable
        onPress={openPicker}
        style={[
          styles.shell,
          {
            backgroundColor: colors.surfaceCard,
            borderColor: errorBorder ? colors.statusError : colors.borderControl,
          },
        ]}>
        <Day1Text variant="bodyRegular16" color={display ? colors.textPrimary : colors.textSecondaryReadable}>
          {display ?? placeholder ?? (mode === 'date' ? 'Elegir fecha' : 'Elegir hora')}
        </Day1Text>
        <Day1Text variant="bodyRegular16">{mode === 'date' ? '📅' : '🕐'}</Day1Text>
      </Pressable>

      {Platform.OS === 'ios' ? (
        <Modal
          visible={iosPickerOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setIosPickerOpen(false)}>
          <View style={styles.backdrop}>
            <View style={[styles.sheet, { backgroundColor: colors.surfaceCard }]}>
              <DateTimePicker
                value={draftValue}
                mode={mode}
                display="spinner"
                minimumDate={minimumDate}
                onChange={(_, selected) => selected && setDraftValue(selected)}
              />
              <Day1Button
                label="Listo"
                variant="primary"
                onPress={() => {
                  onChange(draftValue);
                  setIosPickerOpen(false);
                }}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6, flex: 1 },
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: Spacing[12],
    borderRadius: Radius[12],
    borderWidth: 1,
  },
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    padding: Spacing[16],
    gap: Spacing[12],
    borderTopLeftRadius: Radius[20],
    borderTopRightRadius: Radius[20],
  },
});