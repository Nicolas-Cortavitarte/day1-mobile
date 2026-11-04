import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/AuthProvider';

export function ResetPasswordScreen() {
  const colors = useTheme();
  const { completePasswordReset } = useSession();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setError(null);
    const { error } = await completePasswordReset(password);
    setLoading(false);

    if (error) setError(error);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Day1Text variant="heading28">Nueva contraseña</Day1Text>
          <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
            Escribe tu nueva contraseña dos veces para confirmarla.
          </Day1Text>
        </View>

        <View style={styles.form}>
          <Day1TextField
            label="Nueva contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder="••••••••••••"
            helperText="Al menos 8 caracteres, una letra y un número."
          />

          <Day1TextField
            label="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder="Repite tu contraseña"
          />
        </View>

        {error ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>
            {error}
          </Day1Text>
        ) : null}

        <Day1Button
          label={loading ? 'Guardando...' : 'Guardar contraseña'}
          variant="primary"
          onPress={handleSave}
          disabled={loading || !password || !confirmPassword}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: Spacing[24], gap: Spacing[20] },
  header: { gap: Spacing[12] },
  form: { gap: Spacing[20] },
});