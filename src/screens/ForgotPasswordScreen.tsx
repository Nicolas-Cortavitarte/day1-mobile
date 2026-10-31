import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Day1TextField } from '@/components/molecules/Day1TextField';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/features/auth/AuthProvider';
import type { RootStackParamList } from '@/app/navigation-types';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const colors = useTheme();
  const { requestPasswordReset } = useSession();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRequest() {
    setLoading(true);
    setError(null);
    setNotice(null);

    const { error } = await requestPasswordReset(email);
    setLoading(false);

    if (error) {
      setError(error);
      return;
    }

    setNotice('Te enviamos un correo con un link para restablecer tu contraseña.');
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.backgroundDefault }]}>
      <View style={styles.content}>
        <Day1Text variant="heading28">Recuperar contraseña</Day1Text>
        <Day1Text variant="labelRegular14" color={colors.textSecondaryReadable}>
          Te mandamos un link a tu correo para que puedas crear una nueva.
        </Day1Text>

        <Day1TextField
          label="Correo"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="tu@correo.com"
        />

        {error ? (
          <Day1Text variant="labelRegular14" color={colors.statusError}>
            {error}
          </Day1Text>
        ) : null}

        {notice ? (
          <Day1Text variant="labelRegular14" color={colors.statusSuccess}>
            {notice}
          </Day1Text>
        ) : null}

        <Day1Button
          label={loading ? 'Enviando...' : 'Enviar link'}
          variant="primary"
          onPress={handleRequest}
          disabled={loading || !email}
        />

        <Day1Button
          label="Volver a iniciar sesión"
          variant="ghost"
          onPress={() => navigation.replace('SignIn')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: Spacing[16], gap: Spacing[16] },
});