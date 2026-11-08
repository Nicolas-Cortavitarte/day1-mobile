import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Checkbox } from '@/components/atoms/Day1Checkbox';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { usePreferencesContext } from '@/features/profile/PreferencesProvider';
import { parseSetInput, type SetPayload } from '@/features/workouts/setValidation';
import type { WeightUnit } from '@/features/workouts/types';
import { getErrorMessage } from '@/lib/errors';

type Props = {
  onSubmit: (data: SetPayload) => Promise<void>;
};

export function Day1SetForm({ onSubmit }: Props) {
  const colors = useTheme();
  const { preferences } = usePreferencesContext();
  const defaultUnit: WeightUnit = preferences?.preferredWeightUnit ?? 'KG';

  const [reps, setReps] = useState('');
  const [weightValue, setWeightValue] = useState('');
  const [unitOverride, setUnitOverride] = useState<WeightUnit | null>(null);
  const [durationSeconds, setDurationSeconds] = useState('');
  const [completed, setCompleted] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const weightUnit = unitOverride ?? defaultUnit;

  async function handleSubmit() {
    if (saving) return;

    const result = parseSetInput({ reps, weightValue, durationSeconds, weightUnit, completed });
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSubmit(result.payload);
      setReps('');
      setWeightValue('');
      setDurationSeconds('');
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar la serie.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.box}>
      <View style={styles.row}>
        <Day1TextField
          label="Reps"
          value={reps}
          onChangeText={(text) => {
            setReps(text);
            setError(null);
          }}
          keyboardType="number-pad"
          placeholder="10"
          containerStyle={styles.smallField}
        />
        <Day1TextField
          label="Peso"
          value={weightValue}
          onChangeText={(text) => {
            setWeightValue(text);
            setError(null);
          }}
          keyboardType="decimal-pad"
          placeholder="50"
          containerStyle={styles.smallField}
        />
      </View>

      <View style={styles.row}>
        <Day1Button
          label="KG"
          variant={weightUnit === 'KG' ? 'primary' : 'secondary'}
          onPress={() => setUnitOverride('KG')}
          style={styles.smallField}
        />
        <Day1Button
          label="LB"
          variant={weightUnit === 'LB' ? 'primary' : 'secondary'}
          onPress={() => setUnitOverride('LB')}
          style={styles.smallField}
        />
      </View>

      <Day1TextField
        label="Duración en segundos (opcional)"
        value={durationSeconds}
        onChangeText={(text) => {
          setDurationSeconds(text);
          setError(null);
        }}
        keyboardType="number-pad"
        placeholder="60"
      />

      <View style={styles.checkboxRow}>
        <Day1Checkbox checked={completed} onPress={() => setCompleted((prev) => !prev)} />
        <Day1Text variant="bodyRegular16" color={colors.textPrimary}>
          Serie completada
        </Day1Text>
      </View>

      {error ? (
        <Day1Text variant="labelRegular14" color={colors.statusError}>
          {error}
        </Day1Text>
      ) : null}

      <Day1Button
        label={saving ? 'Guardando...' : 'Agregar serie'}
        variant="secondary"
        onPress={handleSubmit}
        disabled={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: Spacing[10], paddingTop: Spacing[8] },
  row: { flexDirection: 'row', gap: Spacing[10] },
  smallField: { flex: 1, width: 'auto' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[8] },
});
