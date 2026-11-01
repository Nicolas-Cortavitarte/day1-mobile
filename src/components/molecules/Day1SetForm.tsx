import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Checkbox } from '@/components/atoms/Day1Checkbox';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { WeightUnit } from '@/features/workouts/types';

type Props = {
  onSubmit: (data: {
    reps?: number;
    weightValue?: number;
    weightUnit?: WeightUnit;
    durationSeconds?: number;
    completed?: boolean;
  }) => Promise<void>;
};

export function Day1SetForm({ onSubmit }: Props) {
  const colors = useTheme();
  const [reps, setReps] = useState('');
  const [weightValue, setWeightValue] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('KG');
  const [durationSeconds, setDurationSeconds] = useState('');
  const [completed, setCompleted] = useState(true);
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    try {
      await onSubmit({
        reps: reps ? Number(reps) : undefined,
        weightValue: weightValue ? Number(weightValue) : undefined,
        weightUnit: weightValue ? weightUnit : undefined,
        durationSeconds: durationSeconds ? Number(durationSeconds) : undefined,
        completed,
      });
      setReps('');
      setWeightValue('');
      setDurationSeconds('');
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
          onChangeText={setReps}
          keyboardType="number-pad"
          placeholder="10"
          style={styles.smallField}
        />
        <Day1TextField
          label="Peso"
          value={weightValue}
          onChangeText={setWeightValue}
          keyboardType="decimal-pad"
          placeholder="50"
          style={styles.smallField}
        />
      </View>

      <View style={styles.row}>
        <Day1Button
          label="KG"
          variant={weightUnit === 'KG' ? 'primary' : 'secondary'}
          onPress={() => setWeightUnit('KG')}
        />
        <Day1Button
          label="LB"
          variant={weightUnit === 'LB' ? 'primary' : 'secondary'}
          onPress={() => setWeightUnit('LB')}
        />
      </View>

      <Day1TextField
        label="Duración en segundos (opcional)"
        value={durationSeconds}
        onChangeText={setDurationSeconds}
        keyboardType="number-pad"
        placeholder="60"
      />

      <View style={styles.checkboxRow}>
        <Day1Checkbox checked={completed} onPress={() => setCompleted((prev) => !prev)} />
        <Day1Text variant="bodyRegular16" color={colors.textPrimary}>
          Serie completada
        </Day1Text>
      </View>

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
  box: { gap: Spacing[8], paddingTop: Spacing[8] },
  row: { flexDirection: 'row', gap: Spacing[8] },
  smallField: { flex: 1 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[8] },
});